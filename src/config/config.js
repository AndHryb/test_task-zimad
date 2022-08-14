import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export default {
  app: {
    port: process.env.PORT,
  },
  mysql: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpireTime: 600,
    refreshTokenExpireTime: 86400,
    salt: 8,
  },
  cronJobs: {
    deleteExpiredTokens: {
      expression: '59 23 * * 0',
      options: {
        scheduled: true,
      },
    },
  },
  fileStoragePath: path.resolve('file-storage'),
};
