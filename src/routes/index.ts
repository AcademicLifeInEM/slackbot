import * as Botkit from 'botkit';
import * as express from 'express';
import airPro from './airseries-pro/';
import airseries from './airseries/';
import aliemcards from './aliemcards/';
import aliemu from './aliemu/';
import capsules from './capsules/';
const router = express.Router();

export default function route(
    bot: Botkit.Bot,
    controller: Botkit.Controller
): express.Router {
    router.use('/airseries-pro', airPro(bot));
    router.use('/airseries', airseries(bot));
    router.use('/aliemcards', aliemcards(bot));
    router.use('/aliemu', aliemu(bot));
    router.use('/capsules', capsules(bot));

    // Interactive messages
    router.post('/slack/receive', (req, res) => {
        res.status(200);
        const payload = JSON.parse(req.body.payload);
        if (payload.callback_id) {
            const message = { ...payload };
            message.type = 'interactive_message_callback';
            controller.trigger('interactive_message_callback', [bot, message]);
        }
        res.send();
    });

    return router;
}
