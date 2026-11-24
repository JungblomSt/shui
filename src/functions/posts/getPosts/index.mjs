import middy from "@middy/core";
import { getPosts } from "../../../logic/posts.mjs"
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from '../../../middlewares/errorHandler.mjs'
import { validateQuery } from "../../../middlewares/validation.mjs";
import { getPostsQuerySchema } from "../../../model/posts.mjs";


const getPostsHandler = async (event) => {
    const posts = await getPosts(event.queryStringParameters.username);
    return sendResponse(200, posts);
};

export const handler = middy(getPostsHandler)
    .use(errorHandler())
    .use(validateQuery(getPostsQuerySchema));