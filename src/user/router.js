import { Router } from 'express';
import asyncHandler from 'express-async-handler';

export default (userController) => {
  const router = new Router();

  router.get(
    '/info',
    asyncHandler(userController.info),
  );

  return router;
};
