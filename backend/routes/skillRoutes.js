const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');

// Routes protégées par authentification
router.use(auth);

// Ajouter une compétence
router.post('/', skillController.addSkill);

// Supprimer une compétence
router.delete('/:id', skillController.deleteSkill);

// Obtenir les compétences d'un utilisateur
router.get('/user/:userId', skillController.getUserSkills);

// Valider une compétence
router.post('/:skillId/endorse', skillController.endorseSkill);

// Retirer une validation
router.delete('/:skillId/endorse', skillController.removeEndorsement);

module.exports = router; 