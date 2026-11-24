import middy from '@middy/core';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { jsonBody } from '../../../middlewares/jsonBody.mjs';
import { validateBody } from '../../../middlewares/validation.mjs';
import { sendResponse } from '../../../responses/index.mjs';
import { loginSchema } from '../../../model/auth.mjs';
import { login } from '../../../logic/auth.mjs';

const loginHandler = async (event) => {
    const { token, username } = await login(event.body);
    return sendResponse(200, { message: 'Login successful', token, username });
};

export const handler = middy(loginHandler)
.use(errorHandler())
.use(jsonBody())
.use(validateBody(loginSchema));