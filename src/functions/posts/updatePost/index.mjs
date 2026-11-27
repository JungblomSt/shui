import middy from "@middy/core";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticate } from "../../../middlewares/authenticate.mjs";
import { authorizePostOwner } from "../../../middlewares/authorization.mjs";
import { jsonBody } from "../../../middlewares/jsonBody.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { postSchema } from "../../../model/posts.mjs";
import { updatePost } from "../../../logic/posts.mjs";

const updatePostHandler = async (event) => {
    const post = await updatePost(event.pathParameters.postId, event.body);
    return sendResponse(200, {message: 'Post updated successfully', post })
}

export const handler = middy(updatePostHandler)
    .use(errorHandler())
    .use(authenticate())
    .use(authorizePostOwner())
    .use(jsonBody())
    .use(validateBody(postSchema))