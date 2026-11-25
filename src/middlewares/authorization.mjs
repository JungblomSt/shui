import { getPost } from '../logic/posts.mjs'
import { HttpError } from '../responses/index.mjs';

export const authorizePostOwner = () => ({
    before: async (handler) => {
        const post = await getPost(handler.event.pathParameters.postId)

        if (post.isGuest) throw new HttpError(403, 'Guest posts cannot be modified')

        if (post.username !== handler.event.user.username) throw new HttpError(403, 'You are not authorized to perform this action');
        
        handler.event.post = post;
    }
});