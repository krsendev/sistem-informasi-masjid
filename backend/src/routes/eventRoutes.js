const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createEventRules, updateEventRules } = require('../validations/eventValidation');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
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
 *         description: Search by title
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
 *         name: upcoming
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter upcoming events only
 *       - in: query
 *         name: past
 *         schema:
 *           type: string
 *           enum: ['true', 'false']
 *         description: Filter past events only
 *     responses:
 *       200:
 *         description: Daftar event berhasil diambil
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event berhasil diambil
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, category, location, date, startTime, endTime]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ustadz:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 example: '08:00'
 *               endTime:
 *                 type: string
 *                 example: '10:00'
 *               image:
 *                 type: string
 *                 format: binary
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Event berhasil dibuat
 */
router.post('/', upload.single('image'), validate(createEventRules), eventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               ustadz:
 *                 type: string
 *               category:
 *                 type: string
 *               location:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Event berhasil diperbarui
 */
router.put('/:id', upload.single('image'), validate(updateEventRules), eventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event berhasil dihapus
 */
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
