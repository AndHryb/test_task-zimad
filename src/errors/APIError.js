import BaseError from './Error.js';

export default class extends BaseError {
  constructor(code, message) {
    super('APIError', code, message);
  }
}
