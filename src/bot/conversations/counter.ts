import * as Botkit from 'botkit';
import { SingleListener } from '../../core/conversationListener';

export const counter: SingleListener = function(this: Botkit.Controller, { dispatcher }): void {
    const CALLBACK_ID = 'counter';
    this.hears(['counter'], ['direct_mention', 'direct_message'], (bot, message) => {
        bot.reply(message, {
            attachments: [
                {
                    actions: [
                        {
                            name: 'counter',
                            text: 'Increment',
                            type: 'button',
                            value: '1',
                        },
                        {
                            name: 'counter',
                            text: 'Decrement',
                            type: 'button',
                            value: '-1',
                        },
                        {
                            confirm: {
                                dismiss_text: 'No',
                                ok_text: 'Yes',
                                text: 'Really destroy the counter? This is permanent.',
                                title: 'Are you sure?',
                            },
                            name: 'destroy',
                            style: 'danger',
                            text: 'Destroy Counter',
                            type: 'button',
                            value: 'destroy',
                        },
                    ],
                    attachment_type: 'default',
                    callback_id: CALLBACK_ID,
                    fallback: 'An error occurred while preparing the counter',
                    text: '0',
                    title: 'Simple Counter',
                },
            ],
        });
    });
    dispatcher.use({id: CALLBACK_ID, handler});
};

function handler(msg: Botkit.ActionMessage): Botkit.MessageWithContext {
    if (msg.actions[0].name === 'destroy') {
        return { text: 'Counter Destroyed.' };
    }

    const val = parseInt(msg.actions[0].value, 10);
    const count = typeof msg.original_message.attachments[0].text === 'undefined'
        ? 0
        : parseInt(msg.original_message.attachments[0].text, 10);
    msg.original_message.attachments[0].text = `${count + val}`;

    return msg.original_message;
}
