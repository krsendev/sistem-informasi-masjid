const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createFinanceRules, updateFinanceRules } = require('../validations/financeValidation');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/finances/summary:
 *   get:
 *     summary: Get finance summary (total income, expense, balance)
 *     tags: [Finances]
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
 *         description: Ringkasan keuangan berhasil diambil
 */
router.get('/summary', financeController.getSummary);

/**
 * @swagger
 * /api/finances/monthly:
 *   get:
 *     summary: Get monthly finance report
 *     tags: [Finances]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year for the report (defaults to current year)
 *     responses:
 *       200:
 *         description: Laporan bulanan berhasil diambil
 */
router.get('/monthly', financeController.getMonthlyReport);

/**
 * @swagger
 * /api/finances/yearly:
 *   get:
 *     summary: Get yearly finance report
 *     tags: [Finances]
 *     responses:
 *       200:
 *         description: Laporan tahunan berhasil diambil
 */
router.get('/yearly', financeController.getYearlyReport);

/**
 * @swagger
 * /api/finances:
 *   get:
 *     summary: Get all finance records
 *     tags: [Finances]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by description
 *     responses:
 *       200:
 *         description: Daftar keuangan berhasil diambil
 */
router.get('/', financeController.getAllFinances);

/**
 * @swagger
 * /api/finances/{id}:
 *   get:
 *     summary: Get finance record by ID
 *     tags: [Finances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data keuangan berhasil diambil
 */
router.get('/:id', financeController.getFinanceById);

/**
 * @swagger
 * /api/finances:
 *   post:
 *     summary: Create finance record
 *     tags: [Finances]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, category, amount, description, date]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Data keuangan berhasil dibuat
 */
router.post('/', validate(createFinanceRules), financeController.createFinance);

/**
 * @swagger
 * /api/finances/{id}:
 *   put:
 *     summary: Update finance record
 *     tags: [Finances]
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
 *               type:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Data keuangan berhasil diperbarui
 */
router.put('/:id', validate(updateFinanceRules), financeController.updateFinance);

/**
 * @swagger
 * /api/finances/{id}:
 *   delete:
 *     summary: Delete finance record
 *     tags: [Finances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data keuangan berhasil dihapus
 */
router.delete('/:id', financeController.deleteFinance);

module.exports = router;
