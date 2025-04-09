const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode || 500).json({
    status: err.status || 'error' || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  if (err.isOperational) {
    res.status(statusCode).json({
      status: err.status || 'error',
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
  let error = err;

  // Asegurarse de que el error tiene un statusCode y status por defecto
  if (err instanceof AppError) {
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';
  } else {
    // Si no es un AppError, asignamos un mensaje por defecto
    error = { ...err, message: err.message || 'Error interno del servidor' };
  }

  // Si estamos en desarrollo, mostramos más detalles del error
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(error, req, res);
  }

  // En producción, mostramos un mensaje genérico
  sendErrorProd(error, req, res);
};

module.exports = globalErrorMiddleware;
