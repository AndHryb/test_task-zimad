import bcrypt from 'bcryptjs';

export const hashPassword = (password, salt) => bcrypt.hash(password, salt);
