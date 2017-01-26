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

export default function(controller: Botkit.Controller): void {
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
