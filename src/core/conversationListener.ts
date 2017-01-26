import * as Botkit from 'botkit';
import InteractiveMessageDispatcher from './interactiveMessageDispatcher';

export type SingleListener = (
    this: Botkit.Controller,
    params: { dispatcher?: InteractiveMessageDispatcher },
) => void;

export class ConversationListener {
    constructor(private controller: Botkit.Controller, private dispatcher: InteractiveMessageDispatcher) {};
    public use(listener: SingleListener): this {
        listener.call(this.controller, { dispatcher: this.dispatcher });
        return this;
    }
}
