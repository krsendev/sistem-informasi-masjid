const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// No authentication required for public routes

/**
 * @swagger
 * /api/public/announcements:
 *   get:
 *     summary: Get latest published announcements (public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Pengumuman publik berhasil diambil
 */
router.get('/announcements', publicController.getLatestAnnouncements);

/**
 * @swagger
 * /api/public/events:
 *   get:
 *     summary: Get upcoming published events (public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Event publik berhasil diambil
 */
router.get('/events', publicController.getUpcomingEvents);

/**
 * @swagger
 * /api/public/finance-summary:
 *   get:
 *     summary: Get finance summary for current year (public)
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Ringkasan keuangan berhasil diambil
 */
router.get('/finance-summary', publicController.getFinanceSummary);

module.exports = router;
