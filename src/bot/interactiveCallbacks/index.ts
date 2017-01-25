import * as Botkit from 'botkit';
import * as aliemu from './#aliemu';

export default async function interactiveMessageCallbacks(bot: Botkit.Bot, msg: Botkit.ActionMessage) {

    let response: Botkit.MessageWithContext;
    console.log('callback id: ', msg.callback_id);

    try {
        switch (msg.callback_id) {
            case '1':
                response = counter(msg);
                break;
            case 'aliemu-dashboardaccess':
                response = await aliemu.dashboardAccess(msg);
                break;
            default:
                throw { code: 500, message: 'No matching callback ID found.' };
        }
    }
    catch (e) {
        console.error(`=> ERROR (${e.code}): ${e.message}`);
        bot.reply(msg, `ERROR (${e.code}): ${e.message}`);
        return;
    }

    bot.replyInteractive(msg, response);
};


function counter(msg: Botkit.ActionMessage): Botkit.MessageWithContext {
    if (msg.actions[0].name === 'destroy') {
        return { text: 'Counter Destroyed.' };
    }

    const val = parseInt(msg.actions[0].value);
    const count = typeof msg.original_message.attachments[0].text === 'undefined'
        ? 0
        : parseInt(msg.original_message.attachments[0].text);
    msg.original_message.attachments[0].text = `${count + val}`;

    return msg.original_message;
}
