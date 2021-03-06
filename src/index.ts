import * as bodyParser from 'body-parser';
import * as Botkit from 'botkit';
import * as express from 'express';
import rootController from './bot';
import routes from './routes';

const PORT = process.env.PORT || 5000;
const TOKEN = process.env.SLACK_TOKEN;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const controller: Botkit.Controller = Botkit.slackbot({
    interactive_replies: true,
});
const bot = controller.spawn({ token: TOKEN }).startRTM();

rootController(controller);

app.use('/', routes(bot, controller));
app.get('*', (_, res) => res.redirect('https://www.aliem.com'));
app.listen(PORT);
