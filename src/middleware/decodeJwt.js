import jwt from 'jsonwebtoken';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { config } from '../dependencies.js';
import APIError from '../errors/APIError.js';

const JWT_SECRET = config.get('auth.jwtSecret');

const decodeJwt = (req, res, next) => {
  const {
    headers: { authorization = '' },
  } = req;

  if (!authorization.startsWith('Bearer')) {
    return next(new APIError(StatusCodes.UNAUTHORIZED, 'No token provided!'));
  }

  const [, token] = authorization.split(' ');

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
  } catch {
    return next(new APIError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED));
  }

  return next();
};

export default decodeJwt;
