import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { createPool } from 'mysql2/promise';
import ConfigService from './config/config-service.js';
import * as schemas from './validation-schemas/index.js';
import AuthRepository from './auth/repository.js';
import AuthService from './auth/service.js';
import AuthController from './auth/controller.js';
import UsersRepository from './user/repository.js';
import UsersService from './user/service.js';
import UsersController from './user/controller.js';
import RefreshTokenJob from './cronJobs/refresh-token-job.js';

export const config = new ConfigService();

export const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
Object.entries(schemas).forEach(([name, schema]) => {
  ajv.addSchema(schema, name);
});

export const pool = createPool(config.get('mysql'));

export const usersRepository = new UsersRepository(pool);
export const usersService = new UsersService(usersRepository);
export const usersController = new UsersController(usersService);

export const authRepository = new AuthRepository(pool);
export const authService = new AuthService(config, authRepository, usersService);
export const authController = new AuthController(authService);

export const refreshTokenJob = new RefreshTokenJob(authRepository);
