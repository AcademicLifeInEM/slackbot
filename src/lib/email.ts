import * as unirest from 'unirest';

type TemplateName = 'dashboard_approved' | 'dashboard_denied';

const availableTemplates = {
    dashboard_approved: 'faa155e8-c7a2-4e0d-9d8b-8963be230cf1',
    dashboard_denied: 'f4eef738-dd9f-433d-a5e1-9a4107dda5d8',
};

export async function fromTemplate(
    templateName: TemplateName,
    recipient: string
): Promise<number> {
    return new Promise<number>(resolve => {
        unirest
            .post('https://api.sendgrid.com/v3/mail/send')
            .header('Authorization', `Bearer ${process.env.SENDGRID_API_KEY}`)
            .type('json')
            .send({
                personalizations: {
                    to: [
                        {
                            email: recipient,
                        },
                    ],
                },
                from: {
                    email: 'admin@aliemu.com',
                },
                template_id: availableTemplates[templateName],
            })
            .end(response => {
                resolve(response.statusCode);
            });
    });
}
