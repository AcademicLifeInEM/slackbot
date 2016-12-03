import * as Botkit from 'botkit';
import interactiveCallbacks from './interactiveCallbacks/';

export default function(controller: Botkit.Controller, users: UserList): Botkit.Controller {
    controller.hears([/hello/i, /hi/i, /hey/i], ['direct_mention', 'direct_message'], (bot, message) => {
        bot.api.users.info({ user: message.user }, (err, res) => {
            if (err) return;
            bot.reply(message, `Testing! Hello ${res.user.real_name}`);
        });
    });


    // Appear.in Integration Replacement
    controller.hears(['appear.in'], ['direct_mention'], (bot, message) => {
        const user = users[message.user].name;

        bot.startConversation(message, (_, convo) => {
            convo.ask('What would you like the room called?', (resp, c) => {
                const room = resp.text.replace(/\s/g, '-');
                startRoom(room);
                c.next();
            });
        });

        function startRoom(room: string) {
            const msg: Botkit.MessageWithContext = {
                attachments: [
                    {
                        fallback: `${user} has started a video conference in room: <https://appear.in/${room}|${room}>`,
                        color: '#fa4668',
                        author_name: 'appear.in',
                        author_icon: 'https://a.slack-edge.com/2fac/plugins/appearin/assets/service_48.png',
                        text: `${user} has started a video conference in room: <https://appear.in/${room}|${room}>`,
                    },
                ],
            };
            bot.reply(message, msg);
        };
    });

    controller.hears(['counter'], ['direct_mention', 'direct_message'], (bot, message) => {
        bot.reply(message, {
            attachments: [
                {
                    title: 'Simple Counter',
                    text: '0',
                    callback_id: '1',
                    attachment_type: 'default',
                    actions: [
                        {
                            name: 'counter',
                            text: 'Increment',
                            value: '1',
                            type: 'button',
                        },
                        {
                            name: 'counter',
                            text: 'Decrement',
                            value: '-1',
                            type: 'button',
                        },
                        {
                            name: 'destroy',
                            text: 'Destroy Counter',
                            style: 'danger',
                            value: 'destroy',
                            type: 'button',
                            confirm: {
                                title: 'Are you sure?',
                                text: 'This will do something!',
                                ok_text: 'Yes',
                                dismiss_text: 'No',
                            },
                        },
                    ],
                },
            ],
        });
    });

    controller.on('interactive_message_callback', interactiveCallbacks);

    return controller;
}
