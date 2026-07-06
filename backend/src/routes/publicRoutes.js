const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// No authentication required for public routes

/**
 * @swagger
 * /api/public/announcements:
 *   get:
 *     summary: Get published announcements (public, paginated)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pengumuman publik berhasil diambil
 */
router.get('/announcements', publicController.getAnnouncements);

/**
 * @swagger
 * /api/public/announcements/{id}:
 *   get:
 *     summary: Get single published announcement by ID (public)
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pengumuman berhasil diambil
 */
router.get('/announcements/:id', publicController.getAnnouncementById);

/**
 * @swagger
 * /api/public/events:
 *   get:
 *     summary: Get published events (public, paginated)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event publik berhasil diambil
 */
router.get('/events', publicController.getEvents);

/**
 * @swagger
 * /api/public/finance-summary:
 *   get:
 *     summary: Get finance summary with monthly breakdown (public)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ringkasan keuangan berhasil diambil
 */
router.get('/finance-summary', publicController.getFinanceSummary);

module.exports = router;
