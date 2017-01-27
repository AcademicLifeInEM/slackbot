import * as Botkit from 'botkit';

/** Interactive message callback. */
export type ActionCallback = (message: Botkit.ActionMessage) => Slack.Message|Promise<Slack.Message>;

/** Decoupled interactive message callback object. */
export interface DecoupledHandler {
    /** The `callback_id` that was registered for the message. */
    id: string;
    /** The callback function for the given interactive message. */
    handler: ActionCallback;
}

/**
 * Responsible for dispatching interactive callbacks to interactive messages that originate
 * via an external request.
 *
 * This class exists as a way to allow the decoupling of interactive bot messages and their
 * interactive callbacks so that deeply-nested API functions won't need to be imported
 * into the `rootController`.
 *
 * If your intention is to add an interactive conversational method (not originating via an external API call),
 * you should instead be coupling the callback with the message and `use` it with the `conversationListener`.
 */
export default class Dispatcher {
    private static handlers: Map<string, ActionCallback> = new Map();

    /**
     * Registers a given interactive message callback with the Dispatcher.
     */
    public use(cb: DecoupledHandler): this {
        Dispatcher.handlers.set(cb.id, cb.handler);
        return this;
    }

    /**
     * Called by the `rootController` for every interactive message and dispatches
     * the message to the appropriate callback handler.
     *
     * If no handler is found (either because it hasn't been registered or because it was
     * registered with the wrong `callback_id`), then an ephemeral error message is sent to
     * the user that triggered the callback in slack.
     */
    public async handle(bot: Botkit.Bot, msg: Botkit.ActionMessage) {
        const handler = Dispatcher.handlers.get(msg.callback_id);
        if (typeof handler === 'undefined') {
            throw new Error(`Handler not found for callback ${msg.callback_id}`);
        }
        try {
            const response: Slack.Message = await handler.call(this, msg);
            bot.replyInteractive(msg, response);
        }
        catch (e) {
            bot.replyInteractive(msg, {
                replace_original: false,
                response_type: 'ephemeral',
                text: `*Error:* ${e.message}`,
            });
        }
    }
}
