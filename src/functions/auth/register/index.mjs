import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { jsonBody } from "../../../middlewares/jsonBody.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { registerSchema } from "../../../model/auth.mjs";
import { register } from "../../../logic/auth.mjs";

const registerHandler = async (event) => {
    const { username, password } = event.body;
    await register({ username, password });
    return sendResponse(201, { message: 'User registered successfully', username });
};

export const handler = middy(registerHandler)
.use(errorHandler())
.use(jsonBody())
.use(validateBody(registerSchema));