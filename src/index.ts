import * as Botkit from 'botkit';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes';
import rootController from './bot';

const PORT = process.env.PORT || 5000;
const TOKEN = process.env.SLACK_TOKEN;

const CHANNELS = {};
const USERS = {};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const controller: Botkit.Controller = Botkit.slackbot({
    debug: process.env.NODE_ENV !== 'production',
});

controller.createWebhookEndpoints(app);

controller.spawn({ token: TOKEN }).startRTM((err, bot, payload) => {
    if (err) return console.error(err);

    payload.channels
        .filter(c => !c.is_archived)
        .forEach(c => CHANNELS[c.name] = c);

    payload.users
        .filter(u => !u.deleted)
        .forEach(u => USERS[u.id] = u);

    app.use('/', routes(bot));
    rootController(controller, USERS);

    app.get('*', (_, res) => {
        res.redirect('https://www.aliem.com');
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

