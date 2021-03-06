import * as Botkit from 'botkit';
import * as express from 'express';
import { requireAuthentication } from '../../lib/middleware';
import { wordpressComment } from '../../lib/sharedHandlers';
const router = express.Router();
const CHANNEL_ID = 'C8Y62LCGG'; // #ite-prep

export default function route(bot: Botkit.Bot): express.Router {
    router.post('/comments', requireAuthentication, (req, res) =>
        wordpressComment(bot, CHANNEL_ID, req, res)
    );

    return router;
}
