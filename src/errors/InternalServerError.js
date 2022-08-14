import { StatusCodes } from 'http-status-codes';
import BaseError from './Error.js';

export default class extends BaseError {
  constructor() {
    super('InternalServerError', StatusCodes.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}
