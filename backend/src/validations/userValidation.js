const { body } = require('express-validator');
const { ROLES } = require('../constants');

const createUserRules = [
  body('name')
    .notEmpty().withMessage('Nama wajib diisi')
    .trim()
    .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter'),
  body('email')
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('phone')
    .optional()
    .trim(),
  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Role tidak valid (superadmin/admin)'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive harus boolean'),
];

const updateUserRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Nama tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Nama maksimal 100 karakter'),
  body('email')
    .optional()
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim(),
  body('role')
    .optional()
    .isIn(Object.values(ROLES)).withMessage('Role tidak valid (superadmin/admin)'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive harus boolean'),
];

module.exports = {
  createUserRules,
  updateUserRules,
};
