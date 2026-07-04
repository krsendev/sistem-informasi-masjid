const { body } = require('express-validator');
const { EVENT_CATEGORIES } = require('../constants');

const createEventRules = [
  body('title')
    .notEmpty().withMessage('Judul event wajib diisi')
    .trim()
    .isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('description')
    .notEmpty().withMessage('Deskripsi wajib diisi'),
  body('ustadz')
    .optional()
    .trim(),
  body('category')
    .notEmpty().withMessage('Kategori wajib diisi')
    .isIn(EVENT_CATEGORIES).withMessage('Kategori tidak valid'),
  body('location')
    .notEmpty().withMessage('Lokasi wajib diisi')
    .trim(),
  body('date')
    .notEmpty().withMessage('Tanggal wajib diisi')
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO 8601)'),
  body('startTime')
    .notEmpty().withMessage('Waktu mulai wajib diisi')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Format waktu mulai tidak valid (HH:mm)'),
  body('endTime')
    .notEmpty().withMessage('Waktu selesai wajib diisi')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Format waktu selesai tidak valid (HH:mm)'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished harus boolean'),
];

const updateEventRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Judul tidak boleh kosong')
    .isLength({ max: 200 }).withMessage('Judul maksimal 200 karakter'),
  body('description')
    .optional()
    .notEmpty().withMessage('Deskripsi tidak boleh kosong'),
  body('ustadz')
    .optional()
    .trim(),
  body('category')
    .optional()
    .isIn(EVENT_CATEGORIES).withMessage('Kategori tidak valid'),
  body('location')
    .optional()
    .trim()
    .notEmpty().withMessage('Lokasi tidak boleh kosong'),
  body('date')
    .optional()
    .isISO8601().withMessage('Format tanggal tidak valid (gunakan ISO 8601)'),
  body('startTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Format waktu mulai tidak valid (HH:mm)'),
  body('endTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Format waktu selesai tidak valid (HH:mm)'),
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished harus boolean'),
];

module.exports = {
  createEventRules,
  updateEventRules,
};
