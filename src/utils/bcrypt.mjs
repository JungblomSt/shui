import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (password, hashPassword) => {
   return await bcrypt.compare(password, hashPassword);
  
};