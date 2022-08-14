import bcrypt from 'bcryptjs';

export const comparePassword = ({
  enteredPassword,
  hashedPassword,
}) => bcrypt.compare(enteredPassword, hashedPassword);
