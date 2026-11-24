import { verifyToken } from "../utils/jsonWebToken.mjs";
import { HttpError } from "../responses/index.mjs";

const getUserFromHeader = (authHeader) => {
    if (!authHeader.startsWith('Bearer ')) {
        throw new HttpError(401, 'Token must be a Bearer token');
    }

    const token = authHeader.slice('Bearer '.length)
    
    try {
        const user = verifyToken(token);
        return user;
    } catch {
        throw new HttpError(401, 'Invalid or expired token');
    }
}

// om inloggning inte krävs .use(authenticate({ optional: true}))
export const authenticate = ({optional = false} = {}) => ({
    before: async (handler) => {
        const authHeader = handler.event.headers?.authorization;
        if (!authHeader) {
            if (optional) {
                handler.event.user = null;
                return;
            }
            throw new HttpError(401, 'Login is required');
        }
        handler.event.user = getUserFromHeader(authHeader)
    }
});
