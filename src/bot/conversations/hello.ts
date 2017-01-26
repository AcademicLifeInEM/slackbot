import * as Botkit from 'botkit';
import { SingleListener } from '../../core/conversationListener';

export const hello: SingleListener = function(this: Botkit.Controller) {
    this.hears([/hello/i, /hi/i, /hey/i], ['direct_mention', 'direct_message'], (bot, message) => {
        bot.api.users.info({ user: message.user }, (err, res) => {
            if (err) { return; }
            bot.reply(message, `Testing! Hello ${res.user.real_name}`);
        });
    });
};
