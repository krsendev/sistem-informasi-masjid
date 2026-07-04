const { HTTP_STATUS } = require('../constants');

// Global error handler middleware
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} sudah digunakan`;
    errors = [{ field, message }];
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `ID tidak valid: ${err.value}`;
    errors = [{ field: err.path, message }];
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token tidak valid';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token sudah kadaluarsa';
  }

  // Multer errors
  if (err.name === 'MulterError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Ukuran file melebihi batas maksimal (5MB)';
    } else {
      message = err.message;
    }
  }

  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    console.error('Error:', err);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
