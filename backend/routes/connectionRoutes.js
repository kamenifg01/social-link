const express = require('express');
const router = express.Router();
const connectionService = require('../services/connectionService');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Envoyer une demande de connexion
router.post('/request/:targetUserId', async (req, res) => {
  try {
    const connection = await connectionService.sendConnectionRequest(
      req.user.id,
      req.params.targetUserId
    );
    res.status(201).json(connection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Accepter une demande de connexion
router.post('/accept/:requestId', async (req, res) => {
  try {
    const connection = await connectionService.acceptConnectionRequest(
      req.user.id,
      req.params.requestId
    );
    res.json(connection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rejeter une demande de connexion
router.post('/reject/:requestId', async (req, res) => {
  try {
    const connection = await connectionService.rejectConnectionRequest(
      req.user.id,
      req.params.requestId
    );
    res.json(connection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une connexion
router.delete('/:connectionId', async (req, res) => {
  try {
    await connectionService.removeConnection(
      req.user.id,
      req.params.connectionId
    );
    res.json({ message: 'Connexion supprimée avec succès' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtenir la liste des connexions
router.get('/', async (req, res) => {
  try {
    const connections = await connectionService.getConnections(req.user.id);
    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les demandes de connexion en attente
router.get('/pending', async (req, res) => {
  try {
    const requests = await connectionService.getPendingRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les demandes de connexion envoyées
router.get('/sent', async (req, res) => {
  try {
    const requests = await connectionService.getSentRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtenir les connexions mutuelles avec un autre utilisateur
router.get('/mutual/:userId', async (req, res) => {
  try {
    const mutualConnections = await connectionService.getMutualConnections(
      req.user.id,
      req.params.userId
    );
    res.json(mutualConnections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;