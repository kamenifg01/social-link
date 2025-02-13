const { Post, User, UserRelation, Comment, Reaction, Repost, Notification, Like, Share } = require("../models");
const postService = require('../services/postService');
const { Op } = require('sequelize');
const upload = require('../middleware/upload');
const sequelize = require('sequelize');
const postMenuService = require('../services/postMenuService');

exports.createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Erreur création post:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user.id);
    res.json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression post:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Vérifier d'abord si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.json([]);
    }

    // Récupérer tous les posts de l'utilisateur (originaux et reposts)
    const posts = await Post.findAll({
      where: { 
        authorId: userId 
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Post,
          as: 'originalPost',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.json([]);
  }
};

exports.getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const feed = await postService.getFeed(req.user.id, parseInt(page), parseInt(limit));
    res.json(feed);
  } catch (error) {
    console.error('Erreur récupération feed:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Comment,
          as: 'comments',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        },
        {
          model: Reaction,
          as: 'reactions'
        },
        {
          model: Repost,
          as: 'reposts'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des posts',
      error: error.message 
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const like = await postService.likePost(req.params.id, req.user.id);
    res.json(like);
  } catch (error) {
    console.error('Erreur like post:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.findAll({
      where: { postId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    console.error('Erreur récupération commentaires:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires" });
  }
};

exports.getPostComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await Comment.findAndCountAll({
      where: { 
        postId: id,
        parentCommentId: null // Récupérer uniquement les commentaires parents
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Comment,
          as: 'replies',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      comments: comments.rows,
      total: comments.count,
      page: parseInt(page),
      totalPages: Math.ceil(comments.count / limit)
    });
  } catch (error) {
    console.error('getPostComments - Erreur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des commentaires',
      error: error.message 
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user.id;

    // Vérifier si le post existe
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    // Créer le commentaire
    const comment = await Comment.create({
      content,
      postId: id,
      authorId: userId,
      parentCommentId,
      metrics: {
        likes: 0,
        replies: 0,
        reactions: {
          like: 0,
          heart: 0,
          laugh: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      }
    });

    // Mettre à jour les métriques du post
    const metrics = post.metrics || {};
    metrics.comments = (metrics.comments || 0) + 1;
    await post.update({ metrics });

    // Récupérer le commentaire avec les informations de l'auteur
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    console.error('createComment - Erreur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du commentaire',
      error: error.message 
    });
  }
};

exports.reactToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    console.log('reactToPost - Début:', { postId: id, userId, type });

    // Vérifier si le type de réaction est valide
    const validReactionTypes = ['like', 'heart', 'laugh', 'wow', 'sad', 'angry'];
    if (!validReactionTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Type de réaction invalide',
        validTypes: validReactionTypes 
      });
    }

    // Vérifier si le post existe
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    // Supprimer toute réaction existante de l'utilisateur sur ce post
    await Reaction.destroy({
      where: {
        userId,
        postId: id
      }
    });

    // Créer la nouvelle réaction
    const reaction = await Reaction.create({
      postId: id,
      userId,
      type,
      commentId: null
    });

    // Mettre à jour les métriques du post
    const metrics = post.metrics || {};
    metrics.reactions = metrics.reactions || {};
    metrics.reactions[type] = (metrics.reactions[type] || 0) + 1;
    await post.update({ metrics });

    res.status(201).json(reaction);
  } catch (error) {
    console.error('reactToPost - Erreur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la réaction au post',
      error: error.message 
    });
  }
};

exports.repostPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si le post existe
    const originalPost = await Post.findByPk(id);
    if (!originalPost) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    // Vérifier si l'utilisateur n'a pas déjà reposté ce post
    const existingRepost = await Post.findOne({
      where: {
        authorId: userId,
        originalPostId: id
      }
    });

    if (existingRepost) {
      return res.status(400).json({ error: 'Post déjà reposté' });
    }

    // Créer le repost
    const repost = await Post.create({
      authorId: userId,
      originalPostId: id,
      type: 'repost'
    });

    // Incrémenter le compteur de reposts
    await originalPost.increment('repostsCount');

    // Créer une notification pour l'auteur du post original
    if (originalPost.authorId !== userId) {
      await Notification.create({
        type: 'repost',
        recipientId: originalPost.authorId,
        senderId: userId,
        postId: id
      });
    }

    const repostWithDetails = await Post.findByPk(repost.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Post,
          as: 'originalPost',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ]
    });

    res.status(201).json(repostWithDetails);
  } catch (error) {
    console.error('Erreur repost:', error);
    res.status(500).json({ 
      error: 'Erreur lors du repost',
      details: error.message 
    });
  }
};

exports.unrepostPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Trouver le repost
    const repost = await Post.findOne({
      where: {
        originalPostId: id,
        authorId: userId,
        type: 'repost'
      }
    });

    if (!repost) {
      return res.status(404).json({ error: 'Repost non trouvé' });
    }

    // Décrémenter le compteur de reposts du post original
    await Post.decrement('repostsCount', { where: { id } });

    // Supprimer le repost
    await repost.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression repost:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du repost',
      details: error.message 
    });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const share = await postService.sharePost(req.params.id, req.user.id);
    res.status(201).json(share);
  } catch (error) {
    console.error('Erreur partage post:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPostReactions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reactions = await Reaction.findAll({
      where: { postId: id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    // Grouper les réactions par type
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = [];
      }
      acc[reaction.type].push(reaction);
      return acc;
    }, {});

    res.json(groupedReactions);
  } catch (error) {
    console.error('getPostReactions - Erreur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des réactions',
      error: error.message 
    });
  }
};

exports.removeShare = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const share = await Post.findOne({
      where: {
        originalPostId: id,
        authorId: userId,
        type: 'share'
      }
    });

    if (!share) {
      return res.status(404).json({ error: 'Partage non trouvé' });
    }

    // Décrémenter le compteur de partages du post original
    await Post.decrement('sharesCount', { where: { id } });

    await share.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Erreur suppression partage:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression du partage',
      details: error.message 
    });
  }
};

exports.getPostShares = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const shares = await Share.findAndCountAll({
      where: { postId: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });

    res.json({
      shares: shares.rows,
      total: shares.count,
      page: parseInt(page),
      totalPages: Math.ceil(shares.count / limit)
    });
  } catch (error) {
    console.error('Erreur récupération partages:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { visibility } = req.body;
    const userId = req.user.id;

    const post = await Post.findOne({
      where: {
        id,
        authorId: userId
      }
    });

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    await post.update({ visibility });
    res.json({ message: "Visibilité mise à jour avec succès", visibility });
  } catch (error) {
    console.error('Erreur mise à jour visibilité:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la visibilité" });
  }
};

exports.getVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, {
      attributes: ['visibility']
    });

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.json({ visibility: post.visibility });
  } catch (error) {
    console.error('Erreur récupération visibilité:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de la visibilité" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await postService.getPost(req.params.id, req.user.id);
    res.json(post);
  } catch (error) {
    console.error('Erreur récupération post:', error);
    res.status(404).json({ message: error.message });
  }
};

exports.getPostLikes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const likes = await Like.findAndCountAll({
      where: { postId: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profilePicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });

    res.json({
      likes: likes.rows,
      total: likes.count,
      page: parseInt(page),
      totalPages: Math.ceil(likes.count / limit)
    });
  } catch (error) {
    console.error('Erreur récupération likes:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const result = await postService.unlikePost(req.params.id, req.user.id);
    res.json({ success: result });
  } catch (error) {
    console.error('Erreur unlike post:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user.id;

    console.log('removeReaction - Début:', { postId: id, userId, type });

    // Vérifier si le post existe
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post non trouvé' });
    }

    // Supprimer la réaction
    const deletedReaction = await Reaction.destroy({
      where: { 
        postId: id, 
        userId,
        type
      }
    });

    console.log('removeReaction - Réaction supprimée:', { success: !!deletedReaction });

    // Mettre à jour le compteur de réactions
    const reactionCount = await Reaction.count({
      where: { postId: id }
    });

    console.log('removeReaction - Nouveau compteur:', { total: reactionCount });

    // Mettre à jour les métriques du post
    await post.update({ 
      reactionsCount: reactionCount,
      metrics: {
        ...post.metrics,
        reactions: {
          ...post.metrics?.reactions,
          [type]: Math.max(0, (post.metrics?.reactions?.[type] || 0) - 1)
        }
      }
    });

    // Récupérer les réactions mises à jour
    const reactions = await Reaction.findAll({
      where: { postId: id },
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['type']
    });

    const byType = reactions.reduce((acc, r) => ({
      ...acc,
      [r.type]: parseInt(r.get('count'))
    }), {});

    console.log('removeReaction - Répartition par type:', byType);

    const response = {
      total: reactionCount,
      byType,
      currentUserReaction: null
    };

    console.log('removeReaction - Réponse finale:', response);
    res.json(response);

  } catch (error) {
    console.error('Erreur lors de la suppression de la réaction:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la réaction' });
  }
};

exports.getExplorePosts = async (req, res) => {
  try {
    console.log('getExplorePosts - Début de la récupération');
    
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Post,
          as: 'originalPost',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        },
        {
          model: Reaction,
          as: 'reactions'
        }
      ],
      order: [
        ['createdAt', 'DESC']
      ],
      limit: 50
    });

    console.log('getExplorePosts - Posts récupérés:', posts.length);
    
    res.json(posts);
  } catch (error) {
    console.error('getExplorePosts - Erreur:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des posts à explorer',
      error: error.message 
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    console.log('updateComment - Début de la mise à jour', {
      commentId: req.params.commentId,
      userId: req.user.id
    });

    const comment = await Comment.findOne({
      where: {
        id: req.params.commentId,
        authorId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    await comment.update({ content: req.body.content });
    
    console.log('updateComment - Commentaire mis à jour:', comment.id);
    res.json(comment);
  } catch (error) {
    console.error('updateComment - Erreur:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du commentaire',
      error: error.message 
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    console.log('deleteComment - Début de la suppression', {
      commentId: req.params.commentId,
      userId: req.user.id
    });

    const comment = await Comment.findOne({
      where: {
        id: req.params.commentId,
        authorId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    // Décrémenter le compteur de commentaires du post
    await Post.decrement('commentsCount', { where: { id: req.params.id } });
    
    await comment.destroy();
    
    console.log('deleteComment - Commentaire supprimé:', req.params.commentId);
    res.status(204).send();
  } catch (error) {
    console.error('deleteComment - Erreur:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du commentaire',
      error: error.message 
    });
  }
};

exports.unsharePost = async (req, res) => {
  try {
    console.log('unsharePost - Début de la suppression du partage', {
      postId: req.params.id,
      userId: req.user.id
    });

    const result = await postService.unsharePost(req.params.id, req.user.id);
    res.json({ success: result });
  } catch (error) {
    console.error('unsharePost - Erreur:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du partage',
      error: error.message 
    });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const comment = await postService.commentOnPost(
      req.params.id,
      req.user.id,
      req.body.content
    );
    res.status(201).json(comment);
  } catch (error) {
    console.error('Erreur commentaire post:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPostMenuOptions = async (req, res) => {
  try {
    const options = await postMenuService.getPostMenuOptions(req.params.id, req.user.id);
    res.json(options);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.hidePost = async (req, res) => {
  try {
    await postMenuService.hidePost(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.unhidePost = async (req, res) => {
  try {
    await postMenuService.unhidePost(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateVisibility = async (req, res) => {
  try {
    const { visibility } = req.body;
    const post = await postMenuService.updateVisibility(req.params.id, req.user.id, visibility);
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.reportPost = async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await postMenuService.reportPost(req.params.id, req.user.id, reason);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const result = await postMenuService.blockUser(req.user.id, req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const result = await postMenuService.unblockUser(req.user.id, req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
