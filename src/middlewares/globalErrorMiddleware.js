const { default: AppError } = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
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
    if (err instanceof AppError) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
    }

    let error = err;

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(error, req, res);
    }

    error = { ...err };
    error.message = err.message || 'Error interno del servidor';

    sendErrorProd(error, req, res);
};

module.exports = globalErrorMiddleware;