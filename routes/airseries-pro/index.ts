import * as Botkit from 'botkit';
import * as express from 'express';
import messages from './messages';
const router = express.Router();

export default function route(bot: Botkit.Bot): express.Router {

    router.use('/messages', messages(bot));

    router.get('/', (_, res) => {
        res.send('Invalid endpoint.');
    });

    return router;
}
