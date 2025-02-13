const express = require('express');
const router = express.Router();
const { Reaction, Post, User, sequelize } = require('../models');
const auth = require('../middleware/auth');

// Récupérer les réactions d'un post
router.get('/posts/:postId/reactions', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const reactions = await Reaction.findAndCountAll({
      where: { postId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    // Grouper les réactions par type
    const reactionsByType = reactions.rows.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = 0;
      }
      acc[reaction.type]++;
      return acc;
    }, {});

    res.json({
      success: true,
      count: reactions.count,
      reactions: reactions.rows,
      byType: reactionsByType
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réactions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des réactions',
      error: error.message 
    });
  }
});

// Ajouter/Modifier une réaction à un post
router.post('/posts/:postId/reactions', auth, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { postId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    // Vérifier si le post existe
    const post = await Post.findByPk(postId, { transaction: t });
    if (!post) {
      await t.rollback();
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Vérifier si une réaction existe déjà
    let reaction = await Reaction.findOne({
      where: { postId, userId },
      transaction: t
    });

    if (reaction) {
      // Si même type, supprimer la réaction
      if (reaction.type === type) {
        await reaction.destroy({ transaction: t });
        await Post.update(
          {
            metrics: sequelize.literal(`jsonb_set(
              metrics,
              '{reactions,"${type}"}',
              (COALESCE((metrics->'reactions'->>'${type}')::integer, 0) - 1)::text::jsonb
            )`)
          },
          {
            where: { id: postId },
            transaction: t
          }
        );
        await t.commit();
        return res.json({ message: 'Réaction supprimée' });
      } else {
        // Mettre à jour les compteurs pour l'ancien et le nouveau type
        await Post.update(
          {
            metrics: sequelize.literal(`jsonb_set(
              jsonb_set(
                metrics,
                '{reactions,"${reaction.type}"}',
                (COALESCE((metrics->'reactions'->>'${reaction.type}')::integer, 0) - 1)::text::jsonb
              ),
              '{reactions,"${type}"}',
              (COALESCE((metrics->'reactions'->>'${type}')::integer, 0) + 1)::text::jsonb
            )`)
          },
          {
            where: { id: postId },
            transaction: t
          }
        );
        reaction.type = type;
        await reaction.save({ transaction: t });
      }
    } else {
      // Créer une nouvelle réaction
      reaction = await Reaction.create({
        type,
        userId,
        postId,
        commentId: null
      }, { transaction: t });

      // Incrémenter le compteur
      await Post.update(
        {
          metrics: sequelize.literal(`jsonb_set(
            metrics,
            '{reactions,"${type}"}',
            (COALESCE((metrics->'reactions'->>'${type}')::integer, 0) + 1)::text::jsonb
          )`)
        },
        {
          where: { id: postId },
          transaction: t
        }
      );
    }

    // Récupérer la réaction avec les informations de l'utilisateur
    const reactionWithUser = await Reaction.findOne({
      where: { id: reaction.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePicture']
      }],
      transaction: t
    });

    await t.commit();
    res.json({
      message: 'Réaction ajoutée/modifiée avec succès',
      reaction: reactionWithUser
    });
  } catch (error) {
    await t.rollback();
    console.error('Erreur lors de l\'ajout/modification de la réaction:', error);
    res.status(500).json({ 
      message: 'Erreur lors de l\'ajout/modification de la réaction',
      error: error.message 
    });
  }
});

module.exports = router; 