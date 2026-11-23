import { sendResponse, HttpError } from '../responses/index.mjs';

export const errorHandler = () => ({
    onError: (handler) => {
        const error = handler.error;

        if (error instanceof HttpError) {
            handler.response = sendResponse(
                error.statusCode,
                { error: error.message });
            return;
        }

        console.error("ERROR:", error);

        handler.response = sendResponse(500, { error: "Internal Server Error!" });
    }
});