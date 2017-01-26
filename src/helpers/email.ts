import { mail as helper} from 'sendgrid';
import * as sendGrid from 'sendgrid';

const sg = sendGrid(process.env.SENDGRID_API_KEY);

interface TemplateVersion {
    id: string;
    template_id: string;
    active: number;
    name: string;
    html_content: string;
    plain_content: string;
    subject: string;
    /** Format: YYYY-MM-DD HH:MM:SS */
    updated_at: string;
}

interface Template {
    id: string;
    name: string;
    versions: TemplateVersion[];
}

interface AvailableTemplates {
    dashboard_approved: string;
    dashboard_denied: string;
}

const availableTemplates: AvailableTemplates = {
    dashboard_approved: 'faa155e8-c7a2-4e0d-9d8b-8963be230cf1',
    dashboard_denied: 'f4eef738-dd9f-433d-a5e1-9a4107dda5d8',
};

export async function fromTemplate(templateName: keyof AvailableTemplates, recipient: string): Promise<number> {
    const template = await getTemplate(templateName);
    const mail = new helper.Mail(
        new helper.Email('admin@aliemu.com'),
        template.subject,
        new helper.Email(recipient),
        new helper.Content('text/html', template.html_content),
    );
    mail.addCategory(new helper.Category('slackbot'));
    const request = sg.emptyRequest({
        body: mail.toJSON(),
        method: 'POST',
        path: '/v3/mail/send',
    } as any); // FIXME
    const response = await sg.API(request);
    return response.statusCode;
}

async function getTemplate(templateName: keyof AvailableTemplates): Promise<TemplateVersion> {
    const id = availableTemplates[templateName];
    const request = sg.emptyRequest({
        method: 'GET',
        path: `/v3/templates/${id}`,
    }as any); // FIXME
    try {
        const response = await sg.API(request);
        if (response.statusCode !== 200) {
            throw new Error(`Received a non-200 status code from SendGrid: ${response.statusCode}`);
        }
        const template: Template = (response as any).body;
        return template.versions[0];
    }
    catch (e) {
        console.error(`ERROR in getTemplate: ${e.message}`);
        throw e;
    }
}
