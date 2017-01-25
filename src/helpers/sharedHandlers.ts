import * as Botkit from 'botkit';

/**
 * Common handler for routing WordPress comments
 * @param  bot     The bot instance
 * @param  channel The channel ID
 * @param  req     Express request
 * @param  res     Express response
 */
export function wordpressComment(bot: Botkit.Bot, channel: string, req, res) {
    const { name, email, content, postUrl, postName } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
    if (!name || !email || !content || !postUrl || !postName) return res.sendStatus(400);
    bot.say({
        channel: channel,
        text: `Comment Received: *<${postUrl}|${postName}>*`,
        attachments: [
            {
                fallback: `Comment from ${name} <${email}> on ${postName}: ${content}`,
                fields: [
                    {
                        title: 'Comment',
                        value: `${content}`,
                        short: false,
                    },
                    {
                        title: 'From',
                        value: `${name}`,
                        short: true,
                    },
                    {
                        title: 'Email Address',
                        value: `<mailto:${email}|${email}>`,
                        short: true,
                    },
                ],
            },
        ],
    } as Botkit.MessageWithoutContext, err => {
        if (err) return res.sendStatus(503);
        res.sendStatus(200);
    });
}
