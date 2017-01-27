import * as Botkit from 'botkit';
import { SingleListener } from '../../core/conversationListener';

export const appearIn: SingleListener = function(this: Botkit.Controller): void {
    this.hears(['appear.in'], ['direct_mention'], (bot, message) => {
        return new Promise<string>((resolve, reject) => {
            bot.api.users.info({ user: message.user }, (err, data) => {
                if (err) { reject(err); }
                resolve(data.user.real_name);
            });
        })
        .then(user => {
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
                            author_icon: 'https://a.slack-edge.com/2fac/plugins/appearin/assets/service_48.png',
                            author_name: 'appear.in',
                            color: '#fa4668',
                            fallback:
                                `${user} has started a video conference in room: <https://appear.in/${room}|${room}>`,
                            text: `${user} has started a video conference in room: <https://appear.in/${room}|${room}>`,
                        },
                    ],
                };
                bot.reply(message, msg);
            }
        })
        .catch(err => {
            bot.reply(message, `ERROR: ${err.message}`);
        });
    });
};
