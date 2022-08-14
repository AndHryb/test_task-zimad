import { StatusCodes } from 'http-status-codes';
import APIError from '../errors/APIError.js';

const validate = (options) => (req, res, next) => {
  const totalErrors = Object.entries(options).reduce((acc, [property, validateFunction]) => {
    if (!validateFunction(req[property])) {
      const { errors } = validateFunction;
      return [...acc, ...errors];
    }
    return acc;
  }, []);

  if (totalErrors.length) {
    next(new APIError(StatusCodes.BAD_REQUEST, JSON.stringify(totalErrors)));
  }

  next();
};

export default validate;
