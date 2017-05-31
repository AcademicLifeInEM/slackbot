import * as Botkit from 'botkit';
import { SingleListener } from '../../core/conversationListener';

export const pruneFiles: SingleListener = function(this: Botkit.Controller) {
    this.hears(['prune files', 'delete files', 'clean files'], ['direct_mention', 'direct_message'], (bot, message) => {
        bot.startConversation(message, (_, conversation) => {
            conversation.ask('Do you really want me to delete all files > 6 months old?', [
                {
                    callback: deleteOldFiles.bind(bot),
                    pattern: bot.utterances.yes,
                },
                {
                    callback: (__, convo) => {
                        convo.say('No problem. Aborting...');
                        convo.next();
                    },
                    pattern: bot.utterances.no,
                },
            ]);
        });
    });
};

function deleteOldFiles(this: Botkit.Bot, _: Botkit.Convo.Response, convo: Botkit.Conversation): Promise<{}> {
    const d = new Date(Date.now() - 1.577e10); // 6 months in milliseconds
    const unixDate = Math.floor(d.valueOf() / 1000);
    return new Promise<string[]>((res, rej) => {
        this.api.files.list({ token: process.env.ADMIN_SLACK_TOKEN, ts_to: unixDate, count: 1000 }, (err, resp) => {
            if (err || !resp.ok) {
                rej(new Error('An error occurred while attempting to get a list of files.'));
            }
            const fileIDs = resp.files.map(file => file.id);
            res(fileIDs);
        });
    })
    .then(fileIDs => {
        const promises: Array<Promise<boolean>> = [];
        for (const file of fileIDs) {
            promises.push(new Promise((res, rej) => {
                this.api.files.delete({ token: process.env.ADMIN_SLACK_TOKEN, file }, (err, resp) => {
                    if (err || !resp.ok) {
                        rej(new Error('An error occurred when attempting to delete a file.'));
                    }
                    res(resp.ok);
                });
            }));
        }
        return Promise.all(promises).then(data => {
            if (promises.length === 0) {
                convo.say('All old files have been deleted successfully.');
            }
            else {
                convo.say(`${data.length} files deleted successfully.`);
            }
            convo.next();
        });
    })
    .catch(e => {
        convo.say(e.message);
        convo.next();
        return {};
    });
}
