import { getPost } from './posts.mjs';
import { saveComment, getCommentsByPostId } from '../services/comments.mjs';

export const getComments = async (postId) => {
    await getPost(postId) 
    return getCommentsByPostId(postId)
};

export const createComment = async (postId, { content }, user) => {
    await getPost(postId) 
    
    const comment = {
        id : crypto.randomUUID(),
        postId,
        username : user.username,
        content,
        createdAt : new Date().toISOString(),
    }
    await saveComment(comment)
    return comment
};