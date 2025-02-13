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
    req.fileType = fileType;
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé. Types acceptés : ${Object.keys(allowedTypes).join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limite
  }
});

module.exports = upload; 