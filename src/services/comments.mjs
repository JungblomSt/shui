import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLE_NAME } from "./db.mjs";

const toComment = (item) => {
    const { PK, SK, ...comment } = item;
    return comment;
};

export const saveComment = async (comment) => {
    await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            ...comment,
            PK: `POST#${comment.postId}`,
            SK: `COMMENT#${comment.createdAt}#${comment.id}`,
        },
    }));
};

export const getCommentsByPostId = async (postId) => {
    const result = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: { ':pk': `POST#${postId}`, ':prefix': 'COMMENT#' }
    }));
    return result.Items.map(toComment)
}