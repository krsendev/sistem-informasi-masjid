const { body } = require('express-validator');

const loginRules = [
  body('email')
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password wajib diisi'),
];

const updateProfileRules = [
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
];

const changePasswordRules = [
  body('oldPassword')
    .notEmpty().withMessage('Password lama wajib diisi'),
  body('newPassword')
    .notEmpty().withMessage('Password baru wajib diisi')
    .isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
  body('confirmPassword')
    .notEmpty().withMessage('Konfirmasi password wajib diisi')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Konfirmasi password tidak cocok');
      }
      return true;
    }),
];

const refreshTokenRules = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token wajib diisi'),
];

module.exports = {
  loginRules,
  updateProfileRules,
  changePasswordRules,
  refreshTokenRules,
};
