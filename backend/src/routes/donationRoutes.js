const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createDonationRules, updateDonationRules } = require('../validations/donationValidation');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/donations/summary:
 *   get:
 *     summary: Get donation summary (total, donor count, average)
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Ringkasan donasi berhasil diambil
 */
router.get('/summary', donationController.getSummary);

/**
 * @swagger
 * /api/donations/recent:
 *   get:
 *     summary: Get recent donations
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Donasi terbaru berhasil diambil
 */
router.get('/recent', donationController.getRecent);

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all donations
 *     tags: [Donations]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by donor name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Daftar donasi berhasil diambil
 */
router.get('/', donationController.getAllDonations);

/**
 * @swagger
 * /api/donations/{id}:
 *   get:
 *     summary: Get donation by ID
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donasi berhasil diambil
 */
router.get('/:id', donationController.getDonationById);

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create donation
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [donorName, amount, category, date]
 *             properties:
 *               donorName:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               note:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Donasi berhasil dibuat
 */
router.post('/', validate(createDonationRules), donationController.createDonation);

/**
 * @swagger
 * /api/donations/{id}:
 *   put:
 *     summary: Update donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donorName:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               note:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Donasi berhasil diperbarui
 */
router.put('/:id', validate(updateDonationRules), donationController.updateDonation);

/**
 * @swagger
 * /api/donations/{id}:
 *   delete:
 *     summary: Delete donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donasi berhasil dihapus
 */
router.delete('/:id', donationController.deleteDonation);

module.exports = router;
