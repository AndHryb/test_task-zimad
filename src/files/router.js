import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import validate from '../middleware/validate.js';

const upload = multer();

export default (filesController, validator) => {
  const router = new Router();

  router.post(
    '/upload',
    upload.single('file'),
    asyncHandler(filesController.uploadFile),
  );

  router.get(
    '/download/:id',
    validate({ params: validator.getSchema('fileId') }),
    asyncHandler(filesController.downloadFile),
  );

  router.get(
    '/list',
    validate({ query: validator.getSchema('filesListQuery') }),
    asyncHandler(filesController.getFileDataList),
  );

  router.delete(
    '/delete/:id',
    validate({ params: validator.getSchema('fileId') }),
    asyncHandler(filesController.deleteFile),
  );

  router.get(
    '/:id',
    validate({ params: validator.getSchema('fileId') }),
    asyncHandler(filesController.getFileData),
  );

  router.put(
    '/update/:id',
    validate({
      params: validator.getSchema('fileId'),
      body: validator.getSchema('updateFile'),
    }),
    asyncHandler(filesController.updateFileData),
  );

  return router;
};
