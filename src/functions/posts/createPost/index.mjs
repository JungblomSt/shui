import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticate } from "../../../middlewares/authenticate.mjs"
import { jsonBody } from "../../../middlewares/jsonBody.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { postSchema } from "../../../model/posts.mjs";
import { createPost } from "../../../logic/posts.mjs"
import { sendResponse } from "../../../responses/index.mjs";


const createPostHandler = async (event) => {
    const post = await createPost(event.body, event.user);
    return sendResponse(201, {message: 'Post created', post });
};

export const handler = middy(createPostHandler)
    .use(errorHandler())
    .use(authenticate({optional: true }))
    .use(jsonBody())
    .use(validateBody(postSchema));