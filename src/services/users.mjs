import { db, TABLE_NAME } from './db.mjs'; 
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createError } from '@middy/util';

const userKey = (username) => ({ PK: `USER#${username}`, SK: 'PROFILE' });

// Ny användare
export const createUser = async (username, passwordHash) => {
    await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            ...userKey(username),
            username,
            passwordHash,
            createdAt: new Date().toISOString(),
        },
        ConditionExpression: 'attribute_not_exists(PK)', // Förhindra duplicering av användarnamn
    }));
};

// Få användare med användarnamn
export const getUserByUsername = async (username) => {
    const result = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: userKey(username)
    }));

    return result.Item ?? null;
};