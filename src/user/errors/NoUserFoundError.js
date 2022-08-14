import { StatusCodes } from 'http-status-codes';
import BaseError from '../../errors/Error.js';

export default class extends BaseError {
  constructor() {
    super('NoUserFoundError', StatusCodes.NOT_FOUND, 'User not found');
  }
}
