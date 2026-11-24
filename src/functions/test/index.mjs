import middy from '@middy/core';
import { z } from 'zod';
import { errorHandler } from '../../middlewares/errorHandler.mjs';
import { jsonBody } from '../../middlewares/jsonBody.mjs';
import { validateBody } from '../../middlewares/validation.mjs';
import { sendResponse, HttpError } from '../../responses/index.mjs';
import { authenticate } from '../../middlewares/authenticate.mjs';

// const testSchema = z.object({ title: z.string().min(1, "Title is required") });

// const testHandler = async (event) => {
//   const mode = event.queryStringParameters?.mode;
//   if (mode === '404') throw new HttpError(404, 'Not found test');
//   if (mode === 'crash') throw new Error('secret internal details');
//   return sendResponse(200, { body: event.body });
// };

const whoami = async (event) => sendResponse(200, { user: event.user });

export const required = middy(whoami).use(errorHandler()).use(authenticate());
export const optional = middy(whoami).use(errorHandler()).use(authenticate({ optional: true }));

// export const handler = middy(testHandler)
// .use(errorHandler())
// .use(jsonBody())
// .use(validateBody(testSchema));