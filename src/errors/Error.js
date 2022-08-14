export default class BaseError extends Error {
  constructor(name, code, message) {
    super(message);
    this.name = name;
    this.statusCode = code;
    this.message = message;
  }
}
