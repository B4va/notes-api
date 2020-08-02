export default class UniqueViolationError extends Error {
  constructor(message, ...params) {
    super(...params);
    this.message = message;
  }
}
