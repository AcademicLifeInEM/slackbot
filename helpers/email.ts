const helper = require('sendgrid').mail;
const sg: SendGrid.Module = require('sendgrid')(process.env.SENDGRID_API_KEY);

export function fromTemplate(templateName: string, recipient: string): Promise<number> {
    return new Promise((resolve, reject) => {
        getTemplate(templateName)
        .then(template => {
            const mail = new helper.Mail(
                new helper.Email('admin@aliemu.com'),
                template.subject,
                new helper.Email(recipient),
                new helper.Content('text/html', template.html_content),
            );
            mail.addCategory(new helper.Category('slackbot'));
            const request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON(),
            });
            sg.API(request, (err, res) => {
                if (err || res.statusCode !== 202) reject({code: res.statusCode, message: 'Email failed to send'});
                resolve(res.statusCode);
            });
        })
        .catch((e: BotError) => reject(e));
    });
}

function getTemplate(templateName: string): Promise<SendGrid.TemplateVersion> {
    return new Promise<SendGrid.Template[]>((resolve, reject) => {
        const request = sg.emptyRequest({
            method: 'GET',
            path: '/v3/templates',
        });
        sg.API(request, (err, res) => {
            if (err || res.statusCode !== 200) reject({code: res.statusCode, message: 'Cannot GET templates'});
            resolve(JSON.parse(res.body).templates);
        });
    })
    .then((templates: SendGrid.Template[]) => {
        return new Promise<SendGrid.TemplateVersion>((resolve, reject) => {
            const template = templates.find(t => t.name === templateName);
            if (!template) reject({code: 404, message: `Cannot locate template named ${templateName}`});

            const request = sg.emptyRequest({
                method: 'GET',
                path: `/v3/templates/${template.id}/versions/${template.versions[0].id}`,
            });
            sg.API(request, (err, res) => {
                if (err || res.statusCode !== 200) reject({code: res.statusCode, message: 'Cannot GET template version'});
                resolve(JSON.parse(res.body));
            });
        });
    });
}
