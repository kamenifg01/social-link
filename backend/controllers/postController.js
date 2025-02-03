<<<<<<< Updated upstream
const { Post, User, UserRelation, Comment, Like } = require("../models");
=======
const { Post, User, UserRelation, Comment, Like, Share } = require("../models");
>>>>>>> Stashed changes
const postService = require('../services/postService');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configuration de multer pour les différents types de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = 'uploads/';
    
    // Créer des sous-dossiers selon le type de média
    if (file.mimetype.startsWith('image/')) {
      uploadDir += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      uploadDir += 'videos/';
    } else {
      uploadDir += 'documents/';
    }

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

const fileFilter = (req, file, cb) => {
<<<<<<< Updated upstream
  // Définir les types de fichiers autorisés
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif'],
    'video': ['video/mp4', 'video/quicktime'],
    'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
=======
  // Définir les types de fichiers autorisés avec des types MIME plus précis
  const allowedTypes = {
    'image': [
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'image/webp', 
      'image/heic', 
      'image/heif'
    ],
    'video': [
      'video/mp4', 
      'video/quicktime', 
      'video/x-msvideo', 
      'video/x-ms-wmv',
      'video/webm'
    ],
    'document': [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
>>>>>>> Stashed changes
  };

  let isValid = false;
  let fileType = null;

  // Vérifier le type de fichier
  for (const [type, mimeTypes] of Object.entries(allowedTypes)) {
    if (mimeTypes.includes(file.mimetype)) {
      isValid = true;
      fileType = type;
      break;
    }
  }

  if (isValid) {
<<<<<<< Updated upstream
    req.fileType = fileType; // Stocker le type pour une utilisation ultérieure
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
=======
    req.fileType = fileType;
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé. Types acceptés : ${Object.keys(allowedTypes).join(', ')}`), false);
>>>>>>> Stashed changes
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limite
  }
});

exports.createPost = async (req, res) => {
  try {
    const uploadMiddleware = upload.single('media');

    uploadMiddleware(req, res, async (err) => {
      if (err) {
<<<<<<< Updated upstream
        return res.status(400).json({ error: err.message });
      }

      const { content } = req.body;
      const userId = req.user.id;

      let mediaType = 'text';
      let mediaUrl = null;
      let mediaMetadata = null;

      if (req.file) {
        mediaType = req.fileType;
        mediaUrl = req.file.path;
        mediaMetadata = {
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype
        };

        // Ajouter des métadonnées spécifiques selon le type
        if (mediaType === 'video') {
          // TODO: Ajouter la durée de la vidéo
          mediaMetadata.duration = 0;
        }
      }

      const post = await Post.create({
        content,
        userId,
        mediaType,
        mediaUrl,
        mediaMetadata
      });

      const postWithAuthor = await Post.findByPk(post.id, {
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        }]
      });

      res.status(201).json(postWithAuthor);
    });
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ error: 'Erreur lors de la création du post' });
=======
        console.error('Erreur upload:', err);
        return res.status(400).json({ 
          error: err.message,
          details: 'Erreur lors du téléchargement du fichier'
        });
      }

      try {
        const { content } = req.body;
        const userId = req.user.id;

        if (!content && !req.file) {
          return res.status(400).json({ 
            error: 'Le post doit contenir du texte ou un média' 
          });
        }

        let mediaType = 'text';
        let mediaUrl = null;
        let mediaMetadata = null;

        if (req.file) {
          mediaType = req.fileType;
          mediaUrl = req.file.path.replace(/\\/g, '/');
          mediaMetadata = {
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype
          };
        }

        const post = await Post.create({
          content,
          authorId: userId,
          mediaType,
          mediaUrl,
          mediaMetadata
        });

        const postWithAuthor = await Post.findByPk(post.id, {
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        });

        res.status(201).json(postWithAuthor);
      } catch (error) {
        console.error('Erreur création post:', error);
        res.status(500).json({ 
          error: 'Erreur lors de la création du post',
          details: error.message
        });
      }
    });
  } catch (error) {
    console.error('Erreur générale:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message
    });
>>>>>>> Stashed changes
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
    await postService.deletePost(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const userId = req.user.id;
    console.log('Début getFeed - User ID:', userId);

    // Récupérer tous les posts sauf ceux de l'utilisateur connecté
    const posts = await Post.findAll({
      where: {
        authorId: {
          [Op.ne]: userId
        }
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

    console.log('Nombre de posts trouvés:', posts.length);
    res.json(posts);
  } catch (error) {
    console.error('Erreur détaillée du feed:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du feed',
      error: error.message 
    });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: Comment,
          as: 'comments',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }]
        },
        {
          model: Like,
          as: 'likes'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
  }
};
<<<<<<< Updated upstream
=======

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { reactionType = 'like' } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà réagi au post
    const existingLike = await Like.findOne({
      where: { postId, userId }
    });

    if (existingLike) {
      if (existingLike.reactionType === reactionType) {
        // Si même réaction, on la retire
        await existingLike.destroy();
        await post.decrement('likesCount');
        await post.reload();
        return res.json({ 
          message: "Like retiré avec succès", 
          likesCount: post.likesCount,
          isLiked: false,
          reactionType: null
        });
      } else {
        // Si réaction différente, on met à jour
        await existingLike.update({ reactionType });
        return res.json({
          message: "Réaction mise à jour avec succès",
          likesCount: post.likesCount,
          isLiked: true,
          reactionType
        });
      }
    }

    // Sinon, on crée la réaction
    await Like.create({ 
      postId, 
      userId,
      reactionType
    });
    await post.increment('likesCount');
    await post.reload();

    res.json({ 
      message: "Post liké avec succès", 
      likesCount: post.likesCount,
      isLiked: true,
      reactionType
    });
  } catch (error) {
    console.error('Erreur like post:', error);
    res.status(500).json({ message: "Erreur lors du like du post" });
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

exports.createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Le contenu du commentaire est requis" });
    }

    const comment = await Comment.create({
      content,
      postId,
      authorId: userId
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    // Incrémenter le compteur de commentaires du post
    const post = await Post.findByPk(postId);
    await post.increment('commentsCount');

    res.status(201).json(commentWithAuthor);
  } catch (error) {
    console.error('Erreur création commentaire:', error);
    res.status(500).json({ message: "Erreur lors de la création du commentaire" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await comment.update({ content });
    res.json(comment);
  } catch (error) {
    console.error('Erreur mise à jour commentaire:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Décrémenter le compteur de commentaires du post
    const post = await Post.findByPk(comment.postId);
    await post.decrement('commentsCount');

    await comment.destroy();
    res.json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    console.error('Erreur suppression commentaire:', error);
    res.status(500).json({ message: "Erreur lors de la suppression du commentaire" });
  }
};

exports.reactToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;

    // Vérifier que le type de réaction est valide
    const validReactions = ['like', 'heart', 'laugh', 'wow', 'sad', 'angry'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ message: "Type de réaction invalide" });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Retirer toute réaction existante de l'utilisateur
    let oldReactionType = null;
    const reactions = { ...comment.reactions };
    Object.entries(reactions).forEach(([type, users]) => {
      const index = users.indexOf(userId);
      if (index !== -1) {
        oldReactionType = type;
        reactions[type] = users.filter(id => id !== userId);
      }
    });

    // Ajouter la nouvelle réaction
    if (!reactions[reactionType].includes(userId)) {
      reactions[reactionType].push(userId);
    }

    // Mettre à jour le compteur total de réactions
    const totalReactions = Object.values(reactions).reduce(
      (sum, users) => sum + users.length, 
      0
    );

    // Sauvegarder les modifications
    await comment.update({
      reactions,
      reactionsCount: totalReactions
    });

    res.json({
      message: "Réaction ajoutée avec succès",
      reactions,
      reactionsCount: totalReactions
    });
  } catch (error) {
    console.error('Erreur réaction commentaire:', error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la réaction" });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    const { commentId, reactionType } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // Retirer la réaction
    const reactions = { ...comment.reactions };
    if (reactions[reactionType]?.includes(userId)) {
      reactions[reactionType] = reactions[reactionType].filter(id => id !== userId);
    }

    // Mettre à jour le compteur total de réactions
    const totalReactions = Object.values(reactions).reduce(
      (sum, users) => sum + users.length, 
      0
    );

    // Sauvegarder les modifications
    await comment.update({
      reactions,
      reactionsCount: totalReactions
    });

    res.json({
      message: "Réaction retirée avec succès",
      reactions,
      reactionsCount: totalReactions
    });
  } catch (error) {
    console.error('Erreur retrait réaction:', error);
    res.status(500).json({ message: "Erreur lors du retrait de la réaction" });
  }
};

exports.getPostReactions = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const likes = await Like.findAll({
      where: { postId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    // Organiser les réactions par type
    const reactions = {
      like: [],
      heart: [],
      laugh: [],
      wow: [],
      sad: [],
      angry: []
    };

    // Trouver la réaction de l'utilisateur courant
    let currentUserReaction = null;

    likes.forEach(like => {
      reactions[like.reactionType].push({
        userId: like.user.id,
        username: like.user.username,
        profilePicture: like.user.profilePicture
      });

      if (like.userId === userId) {
        currentUserReaction = like.reactionType;
      }
    });

    res.json({
      reactions,
      currentUserReaction
    });
  } catch (error) {
    console.error('Erreur récupération réactions:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des réactions" });
  }
};

exports.repostPost = async (req, res) => {
  try {
    const originalPostId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    // Vérifier si le post original existe
    const originalPost = await Post.findByPk(originalPostId);
    if (!originalPost) {
      return res.status(404).json({ message: "Post original non trouvé" });
    }

    // Créer le repost
    const repost = await Post.create({
      content,
      authorId: userId,
      originalPostId,
      mediaType: originalPost.mediaType,
      mediaUrl: originalPost.mediaUrl,
      mediaMetadata: originalPost.mediaMetadata
    });

    // Incrémenter le compteur de partages du post original
    await originalPost.increment('sharesCount');

    // Récupérer le repost avec les relations
    const repostWithRelations = await Post.findByPk(repost.id, {
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

    res.status(201).json(repostWithRelations);
  } catch (error) {
    console.error('Erreur repost:', error);
    res.status(500).json({ message: "Erreur lors du repost" });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    // Vérifier si le post existe
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà partagé ce post
    const existingShare = await Share.findOne({
      where: { postId, userId }
    });

    if (existingShare) {
      return res.status(400).json({ message: "Vous avez déjà partagé ce post" });
    }

    // Créer le partage
    const share = await Share.create({
      postId,
      userId,
      comment
    });

    // Incrémenter le compteur de partages du post
    await post.increment('sharesCount');

    // Récupérer le partage avec les relations
    const shareWithRelations = await Share.findByPk(share.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Post,
          as: 'post',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ]
    });

    res.status(201).json(shareWithRelations);
  } catch (error) {
    console.error('Erreur partage:', error);
    res.status(500).json({ message: "Erreur lors du partage" });
  }
};
>>>>>>> Stashed changes
