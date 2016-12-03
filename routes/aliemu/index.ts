import * as Botkit from 'botkit';
import * as express from 'express';
import hooks from './hooks';
import messages from './messages';
const router = express.Router();

export default function route(bot: Botkit.Bot): express.Router {

    router.use('/hooks', hooks(bot));
    router.use('/messages', messages(bot));

    router.get('/', (_, res) => {
        res.send('Invalid endpoint.');
    });

    return router;
}
