<<<<<<< Updated upstream
export const API_URL = 'https://e50c-46-193-56-215.ngrok-free.app/api';
=======
export const API_URL = 'https://8265-46-193-56-215.ngrok-free.app/api';  // Pour l'émulateur Android
// export const API_URL = 'http://localhost:3000/api';  // Pour iOS ou le développement local
// export const API_URL = 'https://votre-api-production.com/api';  // Pour la production
>>>>>>> Stashed changes

// Autres configurations globales
export const APP_NAME = 'Social-Link';
export const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

// Configuration des timeouts
export const API_TIMEOUT = 10000; // 10 secondes

// Configuration des limites
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_CAPTION_LENGTH = 2000;
<<<<<<< Updated upstream
export const MAX_COMMENT_LENGTH = 1000; 
=======
export const MAX_COMMENT_LENGTH = 1000;

export const APP_VERSION = '1.0.0';

export const IMAGE_UPLOAD_LIMIT = 5 * 1024 * 1024; // 5MB
export const VIDEO_UPLOAD_LIMIT = 50 * 1024 * 1024; // 50MB
export const DOCUMENT_UPLOAD_LIMIT = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime'];
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]; 
>>>>>>> Stashed changes
