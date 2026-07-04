const { body } = require('express-validator');
const { ANNOUNCEMENT_CATEGORIES, ANNOUNCEMENT_STATUS } = require('../constants');

const createAnnouncementRules = [
  body('title')
    .notEmpty().withMessage('Judul wajib diisi')
    .trim()
    .isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('content')
    .notEmpty().withMessage('Konten wajib diisi'),
  body('category')
    .notEmpty().withMessage('Kategori wajib diisi')
    .isIn(ANNOUNCEMENT_CATEGORIES).withMessage('Kategori tidak valid'),
  body('status')
    .optional()
    .isIn(Object.values(ANNOUNCEMENT_STATUS)).withMessage('Status tidak valid (draft/published)'),
];

const updateAnnouncementRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('content')
    .optional()
    .notEmpty().withMessage('Konten tidak boleh kosong'),
  body('category')
    .optional()
    .isIn(ANNOUNCEMENT_CATEGORIES).withMessage('Kategori tidak valid'),
  body('status')
    .optional()
    .isIn(Object.values(ANNOUNCEMENT_STATUS)).withMessage('Status tidak valid (draft/published)'),
];

module.exports = {
  createAnnouncementRules,
  updateAnnouncementRules,
};
