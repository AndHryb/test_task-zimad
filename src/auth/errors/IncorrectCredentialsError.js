import { StatusCodes } from 'http-status-codes';
import BaseError from '../../errors/Error.js';

export default class extends BaseError {
  constructor() {
    super('IncorrectCredentialsError', StatusCodes.BAD_REQUEST, 'The email address or password is incorrect');
  }
}
