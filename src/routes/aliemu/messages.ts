import * as Botkit from 'botkit';
import * as express from 'express';
import { requireAuthentication } from '../../helpers/authentication';
import { wordpressComment } from '../../helpers/sharedHandlers';
const router = express.Router();
const CHANNEL_ID = 'C09762GTV'; // #aliemu

export default function route(bot: Botkit.Bot): express.Router {

    router.post('/contact-form', requireAuthentication, (req, res) => {
        const { name, email, message } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
        if (!name || !email || !message) { return res.sendStatus(400); }
        bot.say({
            attachments: [
                {
                    fallback: `Contact form message from ${name}: ${message} -- Email: ${email}`,
                    fields: [
                        {
                            short: true,
                            title: 'From',
                            value: `${name}`,
                        },
                        {
                            short: true,
                            title: 'Email Address',
                            value: `<mailto:${email}|${email}>`,
                        },
                        {
                            short: false,
                            title: 'Message',
                            value: `${message}`,
                        },
                    ],
                    title: 'Message Received from Contact Us Form',
                },
            ],
            channel: CHANNEL_ID,
        } as Botkit.MessageWithoutContext, err => err ? res.sendStatus(503) : res.sendStatus(200));
    });

    router.post('/comments', requireAuthentication, (req, res) => (
        wordpressComment(bot, CHANNEL_ID, req, res)
    ));

    router.post('/dashboard-access', requireAuthentication, (req, res) => {
        const { id, name, username, email, program, role, bio } = JSON.parse(req.body.data.replace(/\r\n/g, '\\n'));
        if (!id || !name || !username || !email || !program || !role) { return res.sendStatus(400); }
        bot.say({
            attachments: [
                {
                    actions: [
                        {
                            confirm: {
                                dismiss_text: 'Don\'t Send',
                                ok_text: 'Send Approval Email',
                                text: 'This will send an email to the user saying they have been granted access.',
                                title: 'Are you sure?',
                            },
                            name: 'approve',
                            style: 'primary',
                            text: 'Grant Access',
                            type: 'button',
                            value: 'approve',
                        },
                        {
                            confirm: {
                                dismiss_text: 'Don\'t Send',
                                ok_text: 'Send Rejection Email',
                                text: 'This will send an email to the user saying they have been denied access.',
                                title: 'Are you sure?',
                            },
                            name: 'deny',
                            style: 'danger',
                            text: 'Deny Access',
                            type: 'button',
                            value: 'deny',
                        },
                    ],
                    attachment_type: 'default',
                    callback_id: 'aliemu-dashboardaccess',
                    fallback: `User Requesting Dashboard Access: ${name} <${email}>`,
                    fields: [
                        {
                            short: false,
                            title: 'ID',
                            value: `${id}`,
                        },
                        {
                            short: false,
                            title: 'Name',
                            value: `${name}`,
                        },
                        {
                            short: false,
                            title: 'Email Address',
                            value: `${email}`,
                        },
                        {
                            short: false,
                            title: 'Program',
                            value: `${program}`,
                        },
                        {
                            short: false,
                            title: 'Role',
                            value: `${role}`,
                        },
                        {
                            short: false,
                            title: 'Bio',
                            value: `${bio}`,
                        },
                    ],
                },
            ],
            channel: CHANNEL_ID,
            text: `User Requesting Dashboard Access: *${username}*`,
        } as Botkit.MessageWithoutContext, err => err ? res.sendStatus(503) : res.sendStatus(200));
    });

    return router;
}
