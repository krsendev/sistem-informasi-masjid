const { body } = require('express-validator');
const { DONATION_CATEGORIES } = require('../constants');

const createDonationRules = [
  body('donorName')
    .notEmpty().withMessage('Nama donatur wajib diisi')
    .trim()
    .isLength({ max: 100 }).withMessage('Nama donatur maksimal 100 karakter'),
  body('amount')
    .notEmpty().withMessage('Jumlah donasi wajib diisi')
    .isNumeric().withMessage('Jumlah harus berupa angka')
    .custom((value) => {
      if (parseFloat(value) < 0) throw new Error('Jumlah tidak boleh negatif');
      return true;
    }),
  body('category')
    .notEmpty().withMessage('Kategori wajib diisi')
    .isIn(DONATION_CATEGORIES).withMessage('Kategori tidak valid'),
  body('note')
    .optional()
    .trim(),
  body('date')
    .notEmpty().withMessage('Tanggal wajib diisi')
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO 8601)'),
];

const updateDonationRules = [
  body('donorName')
    .optional()
    .trim()
    .notEmpty().withMessage('Nama donatur tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Nama donatur maksimal 100 karakter'),
  body('amount')
    .optional()
    .isNumeric().withMessage('Jumlah harus berupa angka')
    .custom((value) => {
      if (parseFloat(value) < 0) throw new Error('Jumlah tidak boleh negatif');
      return true;
    }),
  body('category')
    .optional()
    .isIn(DONATION_CATEGORIES).withMessage('Kategori tidak valid'),
  body('note')
    .optional()
    .trim(),
  body('date')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO 8601)'),
];

module.exports = {
  createDonationRules,
  updateDonationRules,
};
