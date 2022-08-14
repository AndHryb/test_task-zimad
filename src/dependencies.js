import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { createPool } from 'mysql2/promise';
import ConfigService from './config/config.service.js';
import configFile from './config/config.js';
import * as schemas from './validation-schemas/index.js';
import AuthRepository from './auth/repository.js';
import AuthService from './auth/service.js';
import AuthController from './auth/controller.js';
import UsersRepository from './user/repository.js';
import UsersService from './user/service.js';
import UsersController from './user/controller.js';
import FilesRepository from './files/repository.js';
import FilesService from './files/service.js';
import FilesController from './files/controller.js';
import RefreshTokenJob from './cronJobs/delete.refresh.token.job.js';

export const config = new ConfigService(configFile);

export const ajv = new Ajv({ allErrors: true, coerceTypes: true });
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

export const filesRepository = new FilesRepository(pool);
export const filesService = new FilesService(filesRepository, config.get('fileStoragePath'));
export const filesController = new FilesController(filesService);

export const refreshTokenJob = new RefreshTokenJob(authRepository);
