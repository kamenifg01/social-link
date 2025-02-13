const { Recommendation, User, Notification } = require('../models');

exports.createRecommendation = async (req, res) => {
  try {
    const { userId, relationship, content } = req.body;
    const authorId = req.user.id;

    if (userId === authorId) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous recommander vous-même" });
    }

    const recommendation = await Recommendation.create({
      userId,
      authorId,
      relationship,
      content,
      status: 'pending'
    });

    // Créer une notification pour l'utilisateur
    await Notification.create({
      type: 'recommendation',
      message: `${req.user.username} vous a envoyé une recommandation`,
      userId,
      senderId: authorId
    });

    res.status(201).json(recommendation);
  } catch (error) {
    console.error('Erreur lors de la création de la recommandation:', error);
    res.status(500).json({ message: "Erreur lors de la création de la recommandation" });
  }
};

exports.updateRecommendationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const recommendation = await Recommendation.findOne({
      where: { id, userId: req.user.id }
    });

    if (!recommendation) {
      return res.status(404).json({ message: "Recommandation non trouvée" });
    }

    await recommendation.update({ status });

    // Créer une notification pour l'auteur
    await Notification.create({
      type: 'recommendation_status',
      message: `${req.user.username} a ${status === 'approved' ? 'accepté' : 'refusé'} votre recommandation`,
      userId: recommendation.authorId,
      senderId: req.user.id
    });

    res.json(recommendation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la recommandation:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la recommandation" });
  }
};

exports.getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const recommendations = await Recommendation.findAll({
      where: { 
        userId,
        status: 'approved'
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des recommandations" });
  }
};

exports.getPendingRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.findAll({
      where: { 
        userId: req.user.id,
        status: 'pending'
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture', 'title']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations en attente:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des recommandations en attente" });
  }
};

exports.deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await Recommendation.findOne({
      where: {
        id,
        [Op.or]: [
          { userId: req.user.id },
          { authorId: req.user.id }
        ]
      }
    });

    if (!recommendation) {
      return res.status(404).json({ message: "Recommandation non trouvée" });
    }

    await recommendation.destroy();
    res.json({ message: "Recommandation supprimée avec succès" });
  } catch (error) {
    console.error('Erreur lors de la suppression de la recommandation:', error);
    res.status(500).json({ message: "Erreur lors de la suppression de la recommandation" });
  }
}; 