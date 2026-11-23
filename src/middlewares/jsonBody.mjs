import { HttpError } from "../responses/index.mjs";

export const jsonBody = () => ({
    before: (handler) => {
        if (!handler.event.body) {
            handler.event.body = {};
            return;
        }
        try {
            handler.event.body = JSON.parse(handler.event.body);
        } catch (error) {
            throw new HttpError(400, "Invalid JSON body");
        }
    }
});