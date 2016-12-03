interface UserList {
    [userID: string]: Slack.User;
}

interface BotError {
    code: number;
    message: string;
}
