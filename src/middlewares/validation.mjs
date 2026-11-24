import { HttpError } from '../responses/index.mjs';

export const validateBody = (schema) => ({
    before: (handler) => {
        const body = handler.event.body;
        const result = schema.safeParse(body);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue.path.join('.');
            throw new HttpError(400, field ? `${field}: ${issue.message}` : issue.message);
        }
        handler.event.body = result.data;
    }
});
export const validateQuery = (schema) => ({
    before: (handler) => {
        const query = handler.event.queryStringParameters ?? {};
        const result = schema.safeParse(query);
        if (!result.success) {
            const issue = result.error.issues[0];
            const field = issue.path.join('.');
            throw new HttpError(400, field ? `${field}: ${issue.message}` : issue.message);
        }
        handler.event.queryStringParameters = result.data;
    }
});