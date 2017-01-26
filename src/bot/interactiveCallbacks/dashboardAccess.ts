import * as Botkit from 'botkit';
import * as email from '../../helpers/email';
import * as REST from '../../helpers/REST/aliemu';

async function handler(msg: Botkit.ActionMessage): Promise<Slack.Message> {
    const response: Slack.Message = {...msg.original_message};

    const { recipientEmail, userID } = msg.original_message.attachments[0].fields.reduce((prev, curr) => {
        if (curr.title === 'Email Address') {
            prev.recipientEmail = curr.value.split('|')[1];
        }
        if (curr.title === 'ID') {
            prev.userID = curr.value;
        }
        return prev;
    }, {} as { recipientEmail: string, userID: string });

    if (!recipientEmail) {
        throw new ReferenceError('Recipient email address could not be identified.');
    }

    switch (msg.actions[0].name) {
        case 'approve': {
            await REST.update.user(userID, { roles: ['educator_access'] });
            await email.fromTemplate('dashboard_approved', recipientEmail);
            response.attachments = [
                response.attachments[0],
                {
                    color: 'good',
                    fallback: 'Access granted and email sent.',
                    title: ':white_check_mark: Educator Dashboard access granted.',
                },
            ];
            return response;
        }
        case 'deny': {
            await email.fromTemplate('dashboard_denied', recipientEmail);
            response.attachments = [
                response.attachments[0],
                {
                    color: 'danger',
                    fallback: 'Rejection email sent',
                    title: ':no_entry: User denied Educator Dashboard access.',
                },
            ];
            return response;
        }
        default:
            throw new Error('Could not identify appropriate action to take.');
    }
}

export const dashboardAccess = {
    id: 'aliemu-dashboardaccess',
    handler,
};
