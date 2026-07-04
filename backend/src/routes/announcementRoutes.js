const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createAnnouncementRules, updateAnnouncementRules } = require('../validations/announcementValidation');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
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
 *         description: Search by title or content
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title, publishedAt]
 *     responses:
 *       200:
 *         description: Daftar pengumuman berhasil diambil
 */
router.get('/', announcementController.getAllAnnouncements);

/**
 * @swagger
 * /api/announcements/{id}:
 *   get:
 *     summary: Get announcement by ID
 *     tags: [Announcements]
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
router.get('/:id', announcementController.getAnnouncementById);

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     summary: Create new announcement
 *     tags: [Announcements]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, category]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Pengumuman berhasil dibuat
 */
router.post('/', upload.single('thumbnail'), validate(createAnnouncementRules), announcementController.createAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   put:
 *     summary: Update announcement
 *     tags: [Announcements]
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
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pengumuman berhasil diperbarui
 */
router.put('/:id', upload.single('thumbnail'), validate(updateAnnouncementRules), announcementController.updateAnnouncement);

/**
 * @swagger
 * /api/announcements/{id}:
 *   delete:
 *     summary: Delete announcement
 *     tags: [Announcements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pengumuman berhasil dihapus
 */
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
