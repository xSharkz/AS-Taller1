const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal. Por favor, inténtelo de nuevo más tarde.',
    });
  }
};

const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, req, res);
  }

  // Opcional: clonar error y controlar mensajes
  let error = { ...err };
  error.message = err.message || 'Error interno del servidor';

  sendErrorProd(error, req, res);
};

module.exports = globalErrorMiddleware;
