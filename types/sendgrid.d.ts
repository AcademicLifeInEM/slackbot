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

    interface SendGridError extends Error {
        response: any;
    }

    interface Request {
        method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
        path: string;
        body?: any;
    }

    interface Response {
        body: any;
        statusCode: number;
        headers: any;
    }

    interface Module {
        API(request: Request): Promise<Response>;
        API(request: Request, cb: (err: SendGridError, res: Response) => void): void;
        emptyRequest(): Request;
        emptyRequest(reqObj: Request): Request;
    }

}
