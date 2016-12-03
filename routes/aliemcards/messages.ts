import * as Botkit from 'botkit';
import * as express from 'express';
import { requireAuthentication } from '../../helpers/authentication';
const router = express.Router();
const CHANNEL_ID = 'C0976C2TZ'; // #aliemcards

export default function route(bot: Botkit.Bot): express.Router {

    router.post('/contact-form', requireAuthentication, (req, res) => {
        const { name, email, message } = req.body.data;
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
        } as Botkit.MessageWithoutContext, (err) => {
            if (err) return res.sendStatus(503);
            res.sendStatus(200);
        });
    });

    return router;
}
