import * as Botkit from 'botkit';
import * as express from 'express';
const router = express.Router();
const CHANNEL_ID = 'C09762GTV'; // #aliemu

export default function route(bot: Botkit.Bot): express.Router {

    router.post('/coveralls', (req, res) => {
        bot.say({
            channel: CHANNEL_ID,
            attachments: [
                {
                    fallback: `Coverage at ${req.body.covered_percent} after commit by ${req.body.committer_name}`,
                    text: `${req.body.committer_name} pushed to \`${req.body.branch}\`: ${req.body.commit_message}`,
                    author_name: 'coveralls.io',
                    author_link: 'https://coveralls.io/github/AcademicLifeInEM/ALiEMU',
                    author_icon: 'https://pbs.twimg.com/profile_images/2993745544/a43e4a04cb9f778842de43f95db59a14_400x400.png',
                    title: 'Coverage Report',
                    fields: [
                        {
                            title: 'Covered Percent',
                            value: `${req.body.covered_percent}`,
                            short: true,
                        },
                        {
                            title: 'Coverage Change',
                            value: `${req.body.coverage_change}`,
                            short: true,
                        },
                    ],
                    image_url: `${req.body.badge_url.replace(/\.svg$/, '.png')}`,
                    mrkdwn_in: ['text'],
                },
            ],
        } as Botkit.MessageWithoutContext);
        res.sendStatus(200);
    });


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
            channel: CHANNEL_ID,
            attachments: [
                {
                    fallback: `Build status: ${payload.status_message}`,
                    color,
                    text: `Build <${payload.build_url}|#${payload.number}> (<${payload.compare_url}|${payload.commit_id}>) of \`${payload.repository.owner_name}/${payload.repository.name}@${payload.branch}\``,
                    author_name: 'Travis CI',
                    author_icon: 'http://tattoocoder.com/content/images/2015/11/travis-logo.png',
                    fields: [
                        {
                            title: 'Status',
                            value: `*${payload.state}* ${timestring}`,
                            short: true,
                        },
                        {
                            title: 'Commit By',
                            value: `${payload.committer_name}`,
                            short: true,
                        },
                    ],
                    mrkdwn_in: ['text', 'fields'],
                },
            ],
        };

        bot.say(message);
        res.sendStatus(200);
    });

    return router;
}
