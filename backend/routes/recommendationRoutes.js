const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

// Routes protégées par authentification
router.use(auth);

// Créer une recommandation
router.post('/', recommendationController.createRecommendation);

// Mettre à jour le statut d'une recommandation
router.put('/:id/status', recommendationController.updateRecommendationStatus);

// Obtenir les recommandations d'un utilisateur
router.get('/user/:userId', recommendationController.getUserRecommendations);

// Obtenir les recommandations en attente
router.get('/pending', recommendationController.getPendingRecommendations);

// Supprimer une recommandation
router.delete('/:id', recommendationController.deleteRecommendation);

module.exports = router; 