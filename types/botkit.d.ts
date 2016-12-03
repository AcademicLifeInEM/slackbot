declare module 'botkit' {

    type MessageWithContext = Msg.AttachmentMessage|Msg.TextMessage|(Msg.AttachmentMessage & Msg.TextMessage);
    type MessageWithoutContext = Msg.AttachmentMessageNoContext|Msg.TextMessageNoContext|(Msg.AttachmentMessageNoContext & Msg.TextMessageNoContext);
    type ActionMessage = Msg.ActionMessage;

    type ConvoCallback = (error: Error, conversation: Conversation) => void;

    interface Bot {

        api: Slack.API;
        config: Config;
        identity: Slack.Identity;
        rtm: Object;
        team_info: Slack.TeamInfo;
        utterances: Utterances;

        _startDM(): void;
        configureIncomingWebhook(): void;
        sendWebhook(): void;
        configureRTM(): void;
        closeRTM(): void;
        destroy(): void;
        identifyBot(): void;
        identifyTeam(): void;
        startPrivateConversation(): void;
        startConversation(src: Message|ActionMessage, callback: ConvoCallback): void;
        send(): void;
        replyInteractive(src: ActionMessage, reply: MessageWithContext): void;
        replyPublic(src: Message|ActionMessage, reply: string|MessageWithContext, callback?: Function): void;
        replyPublicDelayed(src: Message|ActionMessage, reply: string|MessageWithContext, callback?: Function): void;
        replyPrivate(src: Message|ActionMessage, reply: string|MessageWithContext, callback?: Function): void;
        replyPrivateDelayed(src: Message|ActionMessage, reply: string|MessageWithContext, callback?: Function): void;
        /**
         * Makes the bot appear as if it is typing.
         * @param message The current message context.
         */
        startTyping(src: Message): void;
        /** Replies with message after typing delay */
        replyWithTyping(src: Message|ActionMessage, reply: string|MessageWithContext, cb?: Function): void;
        findConversation(): void;
        say(msg: MessageWithoutContext, callback?: (err: Error, res: any) => void): void;

        /**
         * Reply to a message
         * @param message  Incoming message object
         * @param reply    String or Object Outgoing response
         * @param callback Optional callback
         */
        reply(message: Message|ActionMessage, reply: string|MessageWithContext, callback?: (Error, Object) => void): void;

        /** Starts the Slack Realtime Messaging service */
        startRTM(callback: (err: Error, bot: Bot, payload: Slack.RTMPayload) => void): void;
    }

    interface Controller {

        events: {
            message_received: Object;
            direct_message: Object;
            direct_mention: Object;
            mention: Object;
            ambient: Object;
        };
        config: {
            debug: boolean;
            logLevel: 'emergency'
                | 'alert'
                | 'critical'
                | 'error'
                | 'warning'
                | 'notice'
                | 'info' // default
                | 'debug'
                | number;
            /** Allows you to use a separate logger (eg. Winston) */
            logger: Function;
            /** Default: true */
            log: boolean;
        };
        tasks: any[];
        taskCount: number;
        convoCount: number;
        memory_store: {
            users: {};
            channels: {};
            teams: {};
        };
        utterances: Utterances;
        middleware: {
            send: Object;
            receive: Object;
        };
        storage: {
            teams: {
                get(teamid, cb);
                save(team, cb);
                all(cb);
            };
            users: {
                get(userId, cb);
                save(user, cb);
                all(cb);
            };
            channels: {
                get(channelId, cb);
                save(channel, cb);
                all(cb);
            };
        };
        log: {
            (msg): void;
            emergency(msg): void;
            alert(msg): void;
            critical(msg): void;
            error(msg): void;
            warning(msg): void;
            notice(msg): void;
            info(msg): void;
            debug(msg): void;
        };
        logger: {
            log(): any;
        };


        changeEars(): any;
        configureSlackApp(config: Slack.AppConfig): void;
        createHomepageEndpoint(): any;
        createOauthEndpoints(server: any, callback: (err: Error, req: any, res: any) => void): any;
        createWebhookEndpoints(server: any): Controller;
        debug(): void;
        defineBot(): any;
        findTeamById(): any;
        getAuthorizeURL(): any;
        handleSlackEvents(): any;
        hears_regexp(): any;
        hears_test(): any;
        on(a: any, b: any): any;
        receiveMessage(): any;
        saveTeam(teamConfig, callback: (err, id) => void): any;
        setupWebserver(): any;
        shutdown(): any;
        spawn(): any;
        startTask(): any;
        startTicking(): any;
        tick(): any;
        trigger(): any;
        worker(): any;

        /** Used to spawn a bot instance */
        spawn(config: Config): Bot;

        /**
         * Botkit event handler for messages.
         * @param patterns   An array or a comma separated string containing a list of regular expressions to match
         * @param types      An array or a comma separated string of the message events in which to look for the patterns
         * @param middleware Optional function to redefine how patterns are matched. see Botkit Middleware
         * @param callback   function that receives a message object.
         */
        hears(patterns: string|(string|RegExp)[], types: Slack.MessageEvent[], callback: (bot: Bot, message: Message) => void): void;
        hears(patterns: string|(string|RegExp)[], types: Slack.MessageEvent[], middleware: Function, callback: (bot: Bot, message: Message) => void): void;

    }

    interface Config {
        token: string;
    }

    interface Message {
        type: string;
        channel: string;
        user: string;
        text: string;
        attachments: Slack.Attachment[];
        ts: string;
        team: string;
        event: string;
        match: [string, {index: number}, {input: string}];
    }

    namespace Msg {
        interface Basic {
            type?: string;
            text?: string;
            attachments?: Slack.Attachment[];
            channel?: string;
            user?: string;
            ts?: string;
            team?: string;
            event?: string;
            match?: [string, {index: number}, {input: string}]; /** FIXME */
        }
        interface AttachmentMessage extends Basic {
            attachments: Slack.Attachment[];
        }
        interface TextMessage extends Basic {
            text: string;
        }
        interface AttachmentMessageNoContext extends AttachmentMessage {
            channel: string;
        }
        interface TextMessageNoContext extends TextMessage {
            channel: string;
        }
        interface ActionMessage extends Basic {
            actions: {
                name: string;
                value: string;
            }[];
            callback_id: string;
            action_ts: string;
            attachment_id: string;
            token: string;
            original_message: AttachmentMessage|TextMessage;
            response_url: string;
            payload: JSON;
        }
    }

    interface Conversation {
        id: number;
        messages: any[]; /** TODO */
        sent: Convo.BotMessage[];
        transcript: Convo.BotMessage|Convo.Response[];
        events: Object;
        vars: Object;
        topics: {
            [topicName: string]: Object[];
        };
        topic: string;
        /** TODO - this is likely an enum */
        status: string;
        /** TODO: This needs a whole type definition Botkit.Task */
        task: any;
        sourceMessage: Message;
        handler: Function;
        responses: {
            [questionString: string]: Convo.Response;
        };
        capture_options: Object;
        /** Form: 2016-06-07T20:08:03.649Z */
        startTime: string;
        /** Form: 2016-06-07T20:08:03.649Z */
        lastActive: string;

        activate(): void;
        addMessage(): void;
        addQuestion(): void;
        capture(): void;
        capture(): void;
        changeTopic(): void;
        combineMessages(): void;
        deactivate(): void;
        extractResponse(): void;
        extractResponses(): void;
        getResponses(): void;
        getResponsesAsArray(): void;
        handle(): void;
        isActive(): void;
        on(): void;
        repeat(): void;
        replaceTokens(): void;
        sayFirst(): void;
        silentRepeat(): void;
        stop(): void;
        tick(): void;
        trigger(): void;
        say(): void;
        ask(message: string, cb: Convo.Callback): void;
        next(): void;
    }

    interface Utterances {
        yes: RegExpConstructor; // /^(yes|yea|yup|yep|ya|sure|ok|y|yeah|yah)/i
        no: RegExpConstructor; // /^(no|nah|nope|n)/i
    }

    namespace Convo {
        type CallbackFunction = (response: Response, convo: Conversation) => void;
        type CallbackObj = {
            pattern: RegExp|string;
            callback: (response: Response, convo: Conversation) => void;
        }
        type Callback = CallbackFunction|CallbackObj[];
        interface BotMessage {
            text: string;
            channel: string;
            handler: Callback;
        }
        interface Response {
            /** Likely an enum. Known "types" = "message" */
            type: string;
            /** Channel ID */
            channel: string;
            /** User ID */
            user: string;
            /** Response message */
            text: string;
            /** Timestamp -- Form: '1465329972.000029' */
            ts: string;
            /** Team ID */
            team: string;
            /** Question responded to */
            question: string;
        }
    }

    export function slackbot(config: {debug: boolean, storage: any}): Controller;

}
