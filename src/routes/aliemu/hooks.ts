import * as Botkit from 'botkit';
import * as express from 'express';
const router = express.Router();
const CHANNEL_ID = 'C09762GTV'; // #aliemu

export default function route(bot: Botkit.Bot): express.Router {

    router.post('/travis-ci', (req, res) => {
        const payload = JSON.parse(req.body.payload);
        const color = payload.state === 'passed' ? 'good' : 'danger';

        let mins = 0;
        let seconds = payload.duration;
        while (seconds > 60) {
            mins++;
            seconds -= 60;
        }
        const timestring: string = `(${mins} min ${seconds} sec)`;

        const message: Botkit.MessageWithoutContext = {
            attachments: [
                {
                    author_icon: 'http://tattoocoder.com/content/images/2015/11/travis-logo.png',
                    author_name: 'Travis CI',
                    color,
                    fallback: `Build status: ${payload.status_message}`,
                    fields: [
                        {
                            short: true,
                            title: 'Status',
                            value: `*${payload.state}* ${timestring}`,
                        },
                        {
                            short: true,
                            title: 'Commit By',
                            value: `${payload.committer_name}`,
                        },
                    ],
                    mrkdwn_in: ['text', 'fields'],
                    text: `Build <${payload.build_url}|#${payload.number}> (<${payload.compare_url}|${payload.commit_id}>) of \`${payload.repository.owner_name}/${payload.repository.name}@${payload.branch}\``, // tslint:disable-line
                },
            ],
            channel: CHANNEL_ID,
        };

        bot.say(message);
        res.sendStatus(200);
    });

    return router;
}
