import { getAllPosts, getPostById, getPostsByUsername } from "../services/posts.mjs";
import { HttpError } from "../responses/index.mjs";

export const getPosts = async (username) => {
    if(username) return getPostsByUsername(username); 
    return getAllPosts();
};

export const getPost = async (id) => {
    const post = await getPostById(id);
    if(!post) throw new HttpError(404, 'Post not found');
    return post;

}