const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const auth = require('../middleware/auth');

// Routes protégées par authentification
router.use(auth);

// Ajouter une expérience
router.post('/', experienceController.addExperience);

// Mettre à jour une expérience
router.put('/:id', experienceController.updateExperience);

// Supprimer une expérience
router.delete('/:id', experienceController.deleteExperience);

// Obtenir les expériences d'un utilisateur
router.get('/user/:userId', experienceController.getUserExperiences);

module.exports = router; 