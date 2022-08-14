import { StatusCodes } from 'http-status-codes';
import BaseError from '../../errors/Error.js';

export default class extends BaseError {
  constructor(id) {
    super('fileNotFoundError', StatusCodes.NOT_FOUND, `File with id:'${id}' not found`);
  }
}
