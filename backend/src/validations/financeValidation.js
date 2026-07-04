const { body } = require('express-validator');
const { FINANCE_TYPE, FINANCE_CATEGORIES } = require('../constants');

const createFinanceRules = [
  body('type')
    .notEmpty().withMessage('Tipe transaksi wajib diisi')
    .isIn(Object.values(FINANCE_TYPE)).withMessage('Tipe tidak valid (income/expense)'),
  body('category')
    .notEmpty().withMessage('Kategori wajib diisi')
    .isIn(FINANCE_CATEGORIES).withMessage('Kategori tidak valid'),
  body('amount')
    .notEmpty().withMessage('Jumlah wajib diisi')
    .isNumeric().withMessage('Jumlah harus berupa angka')
    .custom((value) => {
      if (parseFloat(value) < 0) throw new Error('Jumlah tidak boleh negatif');
      return true;
    }),
  body('description')
    .notEmpty().withMessage('Deskripsi wajib diisi')
    .trim(),
  body('date')
    .notEmpty().withMessage('Tanggal wajib diisi')
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO 8601)'),
];

const updateFinanceRules = [
  body('type')
    .optional()
    .isIn(Object.values(FINANCE_TYPE)).withMessage('Tipe tidak valid (income/expense)'),
  body('category')
    .optional()
    .isIn(FINANCE_CATEGORIES).withMessage('Kategori tidak valid'),
  body('amount')
    .optional()
    .isNumeric().withMessage('Jumlah harus berupa angka')
    .custom((value) => {
      if (parseFloat(value) < 0) throw new Error('Jumlah tidak boleh negatif');
      return true;
    }),
  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Deskripsi tidak boleh kosong'),
  body('date')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO 8601)'),
];

module.exports = {
  createFinanceRules,
  updateFinanceRules,
};
