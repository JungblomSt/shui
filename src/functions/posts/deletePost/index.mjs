import middy from "@middy/core";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticate } from "../../../middlewares/authenticate.mjs";
import { authorizePostOwner } from "../../../middlewares/authorization.mjs";
import { deletePost } from "../../../logic/posts.mjs";

const deletePostHandler = async (event) => {
    const post = await deletePost(event.pathParameters.postId);
    return sendResponse(204)
}

export const handler = middy(deletePostHandler)
    .use(errorHandler())
    .use(authenticate())
    .use(authorizePostOwner())
