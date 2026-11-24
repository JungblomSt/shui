import { createUser, getUserByUsername } from "../services/users.mjs";
import { hashPassword, comparePasswords } from "../utils/bcrypt.mjs";
import { signToken } from "../utils/jsonWebToken.mjs";
import { HttpError } from "../responses/index.mjs";

export const login = async ({ username, password }) => {
  const user = await getUserByUsername(username);

  if(!user) throw new HttpError(401, 'Invalid username or password');
  if(!await comparePasswords(password, user.passwordHash)) {
    throw new HttpError(401, 'Invalid username or password');
  }

  const token = signToken({username: user.username});
  return { token, username: user.username }
};

export const register = async ({ username, password }) => {
  const passwordHash = await hashPassword(password);

  try {
    await createUser(username, passwordHash);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new HttpError(409, 'Username already exists');
    }
    throw error;
  }
  return { username };
};