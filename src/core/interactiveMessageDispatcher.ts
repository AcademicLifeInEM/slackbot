import * as Botkit from 'botkit';

export type ActionCallback = (message: Botkit.ActionMessage) => Slack.Message|Promise<Slack.Message>;

export default class Dispatcher {
    private static handlers: Map<string, ActionCallback> = new Map();

    public use({id = '', handler = undefined}: {id: string; handler: ActionCallback}): this {
        Dispatcher.handlers.set(id, handler);
        return this;
    }
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
