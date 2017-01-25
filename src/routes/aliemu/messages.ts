import * as Botkit from 'botkit';
import * as express from 'express';
import { requireAuthentication } from '../../helpers/authentication';
import { wordpressComment } from '../../helpers/sharedHandlers';
const router = express.Router();
const CHANNEL_ID = 'C09762GTV'; // #aliemu

export default function route(bot: Botkit.Bot): express.Router {

    router.post('/contact-form', requireAuthentication, (req, res) => {
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
        } as Botkit.MessageWithoutContext, err => {
            if (err) return res.sendStatus(503);
            res.sendStatus(200);
        });
    });

    router.post('/comments', requireAuthentication, (req, res) =>
        wordpressComment(bot, CHANNEL_ID, req, res)
    );

    router.post('/dashboard-access', requireAuthentication, (req, res) => {
        const { id, name, username, email, program, role, bio } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
        if (!id || !name || !username || !email || !program || !role) return res.sendStatus(400);
        bot.say({
            channel: CHANNEL_ID,
            text: `User Requesting Dashboard Access: *${username}*`,
            attachments: [
                {
                    fallback: `User Requesting Dashboard Access: ${name} <${email}>`,
                    callback_id: 'aliemu-dashboardaccess',
                    attachment_type: 'default',
                    fields: [
                        {
                            title: 'ID',
                            value: `${id}`,
                            short: false,
                        },
                        {
                            title: 'Name',
                            value: `${name}`,
                            short: false,
                        },
                        {
                            title: 'Email Address',
                            value: `${email}`,
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
                    actions: [
                        {
                            name: 'approve',
                            value: 'approve',
                            text: 'Grant Access',
                            style: 'primary',
                            type: 'button',
                            confirm: {
                                title: 'Are you sure?',
                                text: 'This will send an email to the user saying they have been granted access.',
                                ok_text: 'Send Approval Email',
                                dismiss_text: 'Don\'t Send',
                            },
                        },
                        {
                            name: 'deny',
                            value: 'deny',
                            text: 'Deny Access',
                            style: 'danger',
                            type: 'button',
                            confirm: {
                                title: 'Are you sure?',
                                text: 'This will send an email to the user saying they have been denied access.',
                                ok_text: 'Send Rejection Email',
                                dismiss_text: 'Don\'t Send',
                            },
                        },
                    ],
                },
            ],
        } as Botkit.MessageWithoutContext, err => {
            if (err) return res.sendStatus(503);
            res.sendStatus(200);
        });
    });

    return router;
}
