const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const notificationRoutes = require('./notificationRoutes');
const messageRoutes = require('./messageRoutes');
const experienceRoutes = require('./experienceRoutes');
const skillRoutes = require('./skillRoutes');
const recommendationRoutes = require('./recommendationRoutes');

// Configuration des routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/experiences', experienceRoutes);
router.use('/skills', skillRoutes);
router.use('/recommendations', recommendationRoutes);

module.exports = router; 