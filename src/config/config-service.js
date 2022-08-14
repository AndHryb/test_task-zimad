import dotenv from 'dotenv';

dotenv.config();

export default class ConfigService {
  #config = {
    app: {
      port: process.env.PORT || 3000,
    },
    mysql: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'test',
      password: process.env.DB_PASSWORD || 'secret',
      multipleStatements: true,
    },
    auth: {
      jwtSecret: 'verySecretKey',
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
  };

  get(path) {
    return this.parsePath(this.#config, path);
  }

  parsePath(config, path) {
    const pathElements = Array.isArray(path) ? path : path.split('.');
    const name = pathElements[0];
    const value = config[name];
    if (pathElements.length <= 1) {
      return value;
    }
    if (value === null || typeof value !== 'object') {
      return undefined;
    }
    return this.parsePath(value, pathElements.slice(1));
  }
}
