import * as express from 'express';
const router = express.Router();
const CHANNEL_ID = 'C09762GTV'; // #aliemu

export default function route(bot: Botkit.Bot): express.Router {

    router.post('/contact-form', (req, res) => {
        const { name, email, message } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
        if (!name || !email || !message) return res.sendStatus(400);
        bot.say({
            channel: CHANNEL_ID,
            attachments: [
                {
                    fallback: `Contact form message from ${name}: ${message} -- Email: ${email}`,
                    title: 'Message Received from Contact Us Form',
                    fields: [
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
                        {
                            title: 'Message',
                            value: `${message}`,
                            short: false,
                        },
                    ],
                },
            ],
        } as Botkit.MessageWithoutContext, (err, resp) => {
            if (err) return res.sendStatus(503);
            res.sendStatus(200);
        });
    });

    router.post('/comments', (req, res) => {
        const { name, email, content, postUrl, postName } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
        if (!name || !email || !content || !postUrl || !postName) return res.sendStatus(400);
        bot.say({
            channel: CHANNEL_ID,
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
        } as Botkit.MessageWithoutContext, (err, resp) => {
            if (err) return res.sendStatus(503);
            res.sendStatus(200);
        });
    });

    router.post('/dashboard-access', (req, res) => {
        const { name, username, email, program, role, bio } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
        if (!name || !username || !email || !program || !role) return res.sendStatus(400);
        bot.say({
            channel: CHANNEL_ID,
            text: `User Requesting Dashboard Access: *${username}*`,
            callback_id: 'aliemu-dashboardaccess',
            attachment_type: 'default',
            attachments: [
                {
                    fallback: `User Requesting Dashboard Access: ${name} <${email}>`,
                    fields: [
                        {
                            title: 'Name',
                            value: `${name}`,
                            short: false,
                        },
                        {
                            title: 'Email Address',
                            value: `<mailto:${email}|${email}>`,
                            short: false,
                        },
                        {
                            title: 'Program',
                            value: `${program}`,
                            short: false,
                        },
                        {
                            title: 'Role',
                            value: `${role}`,
                            short: false,
                        },
                        {
                            title: 'Bio',
                            value: `${bio}`,
                            short: false,
                        },
                    ],
                },
                {
                    fallback: 'Actions',
                    actions: [
                        {
                            name: 'acknowledge',
                            text: 'Acknowledge',
                            style: 'primary',
                            value: 'acknowledge',
                            type: 'button',
                            confirm: {
                                title: 'Are you sure?',
                                text: 'This will send an email to the submitter saying they have been granted access.',
                                ok_text: 'Send',
                                dismiss_text: 'Don\'t send',
                            },
                        },
                    ],
                },
            ],
        } as Botkit.MessageWithoutContext, (err, resp) => {
            if (err) return res.sendStatus(503);
            res.sendStatus(200);
        });
    });

    return router;
}
