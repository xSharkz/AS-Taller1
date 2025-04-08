// src/utils/appError.js
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500;
      this.status = 'error';
      this.isOperational = true;
  
      // Captura el stack trace para el error
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
  