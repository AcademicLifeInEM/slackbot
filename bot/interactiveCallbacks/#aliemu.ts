import * as Botkit from 'botkit';
import * as email from '../../helpers/email';
import { aliemu as templates } from '../../helpers/constants/templateNames';
import * as REST from '../../helpers/REST/aliemu';

export async function dashboardAccess(msg: Botkit.ActionMessage): Promise<Botkit.MessageWithContext> {
    const emailField = msg.original_message.attachments[0].fields.find(field => field.title === 'Email Address');
    if (!emailField) throw {code: 500, message: 'Recipient email address could not be identified.'};
    const recipientEmail = emailField.value.split('|')[1];
    const userID = msg.original_message.attachments[0].fields.find(f => f.title === 'ID').value;

    switch (msg.actions[0].name) {
        case 'approve': {
            try {
                await REST.update.user(userID, { roles: ['educator_access'] });
                await email.fromTemplate(templates.educator_dashboard_approved, recipientEmail);
                return success(msg, {
                    fallback: 'Access granted and email sent.',
                    title: ':white_check_mark: Educator Dashboard access granted.',
                    color: 'good',
                });
            }
            catch (e) { throw e; }
        }
        case 'deny': {
            try {
                await email.fromTemplate(templates.educator_dashboard_denied, recipientEmail);
                return success(msg, {
                    fallback: 'Rejection email sent',
                    title: ':no_entry: User denied Educator Dashboard access.',
                    color: 'danger',
                });
            } catch (e) { throw e; }
        }
        default:
            throw { code: 500, message: 'An error occurred while processing message actions.' };
    }

}


function success(msg: Botkit.ActionMessage, attachment: Slack.Attachment): Botkit.MessageWithContext {
    return {
        ...msg.original_message,
        attachments: [
            { ...msg.original_message.attachments[0], actions: [] },
             attachment,
        ],
    };
}
