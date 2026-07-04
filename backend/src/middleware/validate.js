const { validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../constants');

// Middleware to run express-validator rules and return errors
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(HTTP_STATUS.UNPROCESSABLE).json({
      success: false,
      message: 'Validation Error',
      errors: extractedErrors,
    });
  };
};

module.exports = validate;
