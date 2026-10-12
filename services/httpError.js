// Creates an Error that carries an HTTP status code for controllers / errorHandler to use
export const httpError = (statusCode, message, extra = {}) =>
  Object.assign(new Error(message), { statusCode, ...extra });
