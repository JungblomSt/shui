import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticate } from "../../../middlewares/authenticate.mjs"
import { jsonBody } from "../../../middlewares/jsonBody.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { commentsSchema } from "../../../model/comments.mjs";
import { createComment } from "../../../logic/comments.mjs";
import { sendResponse } from "../../../responses/index.mjs";


const createCommentHandler = async (event) => {
    const comment = await createComment(event.pathParameters.postId, event.body, event.user);
    return sendResponse(201, {message: 'Comment created successfully', comment });
};

export const handler = middy(createCommentHandler)
    .use(errorHandler())
    .use(authenticate())
    .use(jsonBody())
    .use(validateBody(commentsSchema));