const { Post, User, Comment, Reaction, Notification } = require("../models");

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    // Vérifier si le post existe
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    // Vérifier si le commentaire parent existe si spécifié
    if (parentCommentId) {
      const parentComment = await Comment.findByPk(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Commentaire parent non trouvé' });
      }
    }

    // Créer le commentaire
    const comment = await Comment.create({
      content,
      postId,
      authorId: userId,
      parentCommentId,
      metrics: {
        reactions: {
          like: 0,
          love: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      }
    });

    // Mettre à jour les métriques du post
    const metrics = post.metrics || {
      comments: 0,
      reactions: {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0
      }
    };
    metrics.comments++;
    await post.update({ metrics });

    // Créer une notification pour l'auteur du post
    if (post.authorId !== userId) {
      await Notification.create({
        type: 'COMMENT',
        userId: post.authorId,
        senderId: userId,
        postId,
        commentId: comment.id,
        message: `${req.user.username} a commenté votre post`
      });
    }

    // Récupérer le commentaire avec les relations
    const commentWithRelations = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    res.status(201).json(commentWithRelations);
  } catch (error) {
    console.error('addComment - Erreur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du commentaire',
      error: error.message 
    });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await Comment.findAndCountAll({
      where: { postId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture']
      }, {
        model: Reaction,
        as: 'reactions'
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      comments: comments.rows,
      total: comments.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(comments.count / limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce commentaire' });
    }

    await comment.update({ content });

    res.json(comment);
  } catch (error) {
    console.error('Erreur lors de la modification du commentaire:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du commentaire' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
    }

    // Décrémenter le compteur de commentaires du post
    await Post.decrement('metrics.comments', { where: { id: comment.postId }});

    await comment.destroy();

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
  }
};

exports.reactToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    let reaction = await Reaction.findOne({
      where: { commentId, userId }
    });

    if (reaction) {
      if (reaction.type === type) {
        await reaction.destroy();
        await Comment.decrement(`metrics.reactions.${type}`, {
          where: { id: commentId }
        });
        return res.json({ message: 'Réaction supprimée' });
      } else {
        await Comment.decrement(`metrics.reactions.${reaction.type}`, {
          where: { id: commentId }
        });
        reaction.type = type;
        await reaction.save();
      }
    } else {
      reaction = await Reaction.create({
        type,
        userId,
        commentId
      });
    }

    await Comment.increment(`metrics.reactions.${type}`, {
      where: { id: commentId }
    });

    res.json({
      message: 'Réaction ajoutée/modifiée avec succès',
      reaction
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout/modification de la réaction:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout/modification de la réaction' });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    const { commentId, reactionType } = req.params;
    const userId = req.user.id;

    const reaction = await Reaction.findOne({
      where: { commentId, userId, type: reactionType }
    });

    if (!reaction) {
      return res.status(404).json({ message: 'Réaction non trouvée' });
    }

    await reaction.destroy();
    await Comment.decrement(`metrics.reactions.${reactionType}`, {
      where: { id: commentId }
    });

    res.json({ message: 'Réaction supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réaction:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la réaction' });
  }
};
    
