import * as Botkit from 'botkit';
import { ConversationListener } from '../core/conversationListener';
import InteractiveMessageDispatcher from '../core/interactiveMessageDispatcher';

import {
    appearIn,
    counter,
    hello,
} from './conversations/';

import {
    dashboardAccess,
} from './interactiveCallbacks/';

/**
 * The root controller for the entire slackbot. All integrations must be
 * imported and used here.
 * @param controller    The main controller object for the slackbot.
 */
export default function rootController(controller: Botkit.Controller): void {
    const interactiveDispatcher = new InteractiveMessageDispatcher();
    const convoListener = new ConversationListener(controller, interactiveDispatcher);

    convoListener
        .use(appearIn)
        .use(counter)
        .use(hello);

    interactiveDispatcher
        .use(dashboardAccess);

    controller.on('interactive_message_callback', interactiveDispatcher.handle);
}
