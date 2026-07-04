const { HTTP_STATUS } = require('../constants');

// Send a success response
const successResponse = (res, message, data = null, statusCode = HTTP_STATUS.OK) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

// Send an error response
const errorResponse = (res, message, errors = [], statusCode = HTTP_STATUS.BAD_REQUEST) => {
  const response = {
    success: false,
    message,
  };
  if (errors.length > 0) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

// Send a paginated success response
const paginatedResponse = (res, message, data, pagination) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};
