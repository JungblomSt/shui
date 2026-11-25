import middy from "@middy/core";
import { getComments } from "../../../logic/comments.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from '../../../middlewares/errorHandler.mjs'

const getCommentsHandler = async (event) => {
    const post = await getComments(event.pathParameters.postId);
    return sendResponse(200, post);
};

export const handler = middy(getCommentsHandler)
    .use(errorHandler())