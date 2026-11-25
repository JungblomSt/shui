import { deletePostAndComments, getAllPosts, getPostById, getPostsByUsername, savePost, updatePostContent } from "../services/posts.mjs";
import { generateGuestName } from "../utils/guestNames.mjs";
import { HttpError } from "../responses/index.mjs";

export const getPosts = async (username) => {
    if(username) return getPostsByUsername(username); 
    return getAllPosts();
};

export const getPost = async (id) => {
    const post = await getPostById(id);
    if(!post) throw new HttpError(404, 'Post not found');
    return post;
};

export const createPost = async ({ title, content }, user) => {
    let username
    let isGuest
    if(user) {
        username = user.username
        isGuest = false 
    } else {
        username = generateGuestName()
        isGuest = true
    }
    
    const now = new Date().toISOString()

    const post = {
        id : crypto.randomUUID(),
        username,
        isGuest,
        title,
        content,
        createdAt : now,
        updatedAt : now
    }
    await savePost(post)
    return post
};

export const updatePost = async (id, { title, content }) => {
    const updatedAt = new Date().toISOString()
    return updatePostContent(id, { title, content, updatedAt }) 
};

export const deletePost = async (id) => {
    await deletePostAndComments(id)
};