import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import validate from '../middleware/validate.js';
import decodeJwt from '../middleware/decodeJwt.js';

export default (authController, validator) => {
  const router = new Router();

  router.post(
    '/signup',
    validate({ body: validator.getSchema('register') }),
    asyncHandler(authController.register),
  );

  router.post(
    '/signin',
    validate({ body: validator.getSchema('login') }),
    asyncHandler(authController.login),
  );

  router.post(
    '/signin/new_token',
    validate({ body: validator.getSchema('refreshToken') }),
    asyncHandler(authController.refreshToken),
  );

  router.delete(
    '/logout',
    decodeJwt,
    validate({ body: validator.getSchema('refreshToken') }),
    asyncHandler(authController.logout),
  );

  return router;
};
