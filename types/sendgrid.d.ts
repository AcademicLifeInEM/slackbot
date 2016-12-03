
declare namespace SendGrid {

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

}
