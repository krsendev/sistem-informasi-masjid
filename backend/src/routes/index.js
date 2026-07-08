const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const announcementRoutes = require('./announcementRoutes');
const eventRoutes = require('./eventRoutes');
const financeRoutes = require('./financeRoutes');
const publicRoutes = require('./publicRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/announcements', announcementRoutes);
router.use('/events', eventRoutes);
router.use('/finances', financeRoutes);
router.use('/public', publicRoutes);

module.exports = router;
