const { HTTP_STATUS } = require('../constants');

// Handle 404
const notFound = (req, res, _next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
