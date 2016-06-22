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

        bot.startConversation(message, (err, convo) => {
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

    controller.hears(['testing'], ['direct_mention', 'direct_message'], (bot, message) => {
        bot.reply(message, {
            attachments: [
                {
                    fallback: '',
                    title: 'Do you want to interact with my buttons?',
                    callback_id: '123',
                    attachment_type: 'default',
                    actions: [
                        {
                            'name': 'yes',
                            'text': 'Yes',
                            'value': 'yes',
                            'type': 'button',
                        },
                        {
                            'name': 'no',
                            'text': 'No',
                            'value': 'no',
                            'type': 'button',
                        },
                    ],
                },
            ],
        });
    });


    return controller;
}
