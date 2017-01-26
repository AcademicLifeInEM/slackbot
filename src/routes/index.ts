import * as Botkit from 'botkit';
import * as express from 'express';
import airPro from './airseries-pro/';
import airseries from './airseries/';
import aliemcards from './aliemcards/';
import aliemu from './aliemu/';
import capsules from './capsules/';
const router = express.Router();

export default function route(bot: Botkit.Bot): express.Router {
    router.use('/airseries-pro', airPro(bot));
    router.use('/airseries', airseries(bot));
    router.use('/aliemcards', aliemcards(bot));
    router.use('/aliemu', aliemu(bot));
    router.use('/capsules', capsules(bot));
    return router;
};
