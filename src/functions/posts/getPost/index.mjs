import middy from "@middy/core";
import { getPost } from "../../../logic/posts.mjs"
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from '../../../middlewares/errorHandler.mjs'

const getPostHandler = async (event) => {
    const post = await getPost(event.pathParameters.postId);
    return sendResponse(200, post);
};

export const handler = middy(getPostHandler)
    .use(errorHandler())