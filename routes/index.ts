import * as Botkit from 'botkit';
import * as express from 'express';
import airseries from './airseries/';
import airPro from './airseries-pro/';
import aliemu from './aliemu/';
import capsules from './capsules/';
import newsubmissions from './newsubmissions/';
import aliemcards from './aliemcards/';
const router = express.Router();

export default function route(bot: Botkit.Bot): express.Router {
    router.use('/airseries', airseries(bot));
    router.use('/airseries-pro', airPro(bot));
    router.use('/aliemu', aliemu(bot));
    router.use('/capsules', capsules(bot));
    router.use('/newsubmissions', newsubmissions(bot));
    router.use('/aliemcards', aliemcards(bot));
    return router;
};
