import { db, TABLE_NAME } from "./db.mjs";
import { GetCommand, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const postKey = (id) => ({ PK: `POST#${id}`, SK: 'POST' });

const toPost = (item) => {
    const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...post } = item;
    return post;
};

// hämta alla inlägg sorterade på createdAt dvs. senaste först
export const getAllPosts = async () => {
    const result = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        ExpressionAttributeValues: { ':pk': 'POSTS' },
        ScanIndexForward: false,
    }));
    return result.Items.map(toPost);
};

// hämta inlägg baserade på username
export const getPostsByUsername = async (username) => {
    const result = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: { ':pk': `USER#${username}` },
        ScanIndexForward: false,
    }));
    return result.Items.map(toPost);
};

// hämta inlägg baserade på id
export const getPostById = async (id) => {
    const result = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: postKey(id),
    }));
    return result.Item ? toPost(result.Item) : null;
};

// spara inlägg i db
export const savePost = async (post) => {
    await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            ...post,
            ...postKey(post.id),
            GSI1PK: `USER#${post.username}`,
            GSI1SK: post.createdAt,
            GSI2PK: 'POSTS',
            GSI2SK: post.createdAt,
        },
    }));
};