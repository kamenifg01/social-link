// URL de l'API
export const API_URL = 'https://8265-46-193-56-215.ngrok-free.app/api';

// URL pour les médias
export const MEDIA_URL = 'https://8265-46-193-56-215.ngrok-free.app';

// Configuration par défaut pour axios
export const axiosConfig = {
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Fonction utilitaire pour construire les URLs des médias
export const getMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return null;
  
  if (mediaUrl.startsWith('http')) {
    return mediaUrl;
  }
  
  // Supprimer le préfixe 'api/' s'il existe
  const cleanMediaUrl = mediaUrl.replace(/^api\//, '');
  return `${API_URL}/${cleanMediaUrl}`;
}; 