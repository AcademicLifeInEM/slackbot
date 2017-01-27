import * as Botkit from 'botkit';
import InteractiveMessageDispatcher from './interactiveMessageDispatcher';

/**
 * A function that encapsulates a single conversation listener.
 *
 * The `rootController` is bound to `this` automatically.
 *
 * If the encapsulated listener contains interactive messages, then the callback function
 * should be `use`d by by calling `dispatcher.use()` using the dispatcher provided within
 * the second param object.
 */
export type SingleListener = (
    this: Botkit.Controller,
    params: { dispatcher?: InteractiveMessageDispatcher },
) => void;

/** Responsible for registering all converstion listeners with the `rootController`. */
export class ConversationListener {
    constructor(private controller: Botkit.Controller, private dispatcher: InteractiveMessageDispatcher) {}
    public use(listener: SingleListener): this {
        listener.call(this.controller, { dispatcher: this.dispatcher });
        return this;
    }
}
