const { Post, User, UserRelation, Comment, Like } = require("../models");
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
  // Définir les types de fichiers autorisés
  const allowedTypes = {
    'image': ['image/jpeg', 'image/png', 'image/gif'],
    'video': ['video/mp4', 'video/quicktime'],
    'document': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
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
    req.fileType = fileType; // Stocker le type pour une utilisation ultérieure
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'), false);
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
