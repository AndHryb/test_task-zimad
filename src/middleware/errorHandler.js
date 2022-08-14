/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "req|next" }] */

import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const {
    statusCode: code = StatusCodes.INTERNAL_SERVER_ERROR,
    message = 'Something failed!',
  } = err;

  res.status(code).json({ code, message });
};

export default errorHandler;
