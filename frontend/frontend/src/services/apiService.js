import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilisez l'adresse IP de votre machine sur le réseau local
const API_URL = "https://e50c-46-193-56-215.ngrok-free.app/api";  // Remplacez X par le dernier numéro de votre IP

// Fonction pour récupérer le token
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('Aucun token trouvé dans AsyncStorage');
      throw new Error('No token found');
    }
    return token;
  } catch (error) {
    console.error('Erreur récupération token:', error);
    throw error;
  }
};

// Fonction pour rafraîchir le token
const refreshAuthToken = async () => {
  try {
    const currentToken = await getAuthToken();
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      token: currentToken,
    });
    const newToken = response.data.token;
    await AsyncStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    throw error;
  }
};

// Authentification
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const signUp = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
  return response.data;
};

// Posts
export const fetchPosts = async () => {
  try {
    const token = await getAuthToken();
    console.log('Appel API feed - URL:', `${API_URL}/posts/feed`);
    
    const response = await axios.get(`${API_URL}/posts/feed`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response.data;
  } catch (error) {
    if (error.message === 'No token found') {
      return []; // Retourner un tableau vide si pas de token
    }
    console.error('Erreur détaillée du feed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const token = await getAuthToken();
    
    // Si c'est un objet simple, l'envoyer comme JSON
    if (!(postData instanceof FormData)) {
      const response = await axios.post(`${API_URL}/posts`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    }
    
    // Si c'est un FormData, l'envoyer comme multipart
    const response = await axios.post(`${API_URL}/posts`, postData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const updatePost = async (postId, updatedData) => {
  const token = await getAuthToken();
  const response = await axios.put(`${API_URL}/posts/${postId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePost = async (postId) => {
  const token = await getAuthToken();
  const response = await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// User
export const fetchProfile = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // Si le profil n'existe pas, créer un profil par défaut
      const defaultProfile = {
        username: 'Utilisateur',
        title: '',
        company: '',
        location: '',
        bio: ''
      };
      
      // Créer le profil avec les valeurs par défaut
      const createdProfile = await updateProfile(defaultProfile);
      return createdProfile;
    }
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = await getAuthToken();
    console.log('URL de la requête:', `${API_URL}/user/profile`);
    console.log('Données envoyées:', profileData);
    console.log('Token:', token);
    
    const response = await axios.put(`${API_URL}/user/profile`, profileData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    // Stocker le profil mis à jour dans AsyncStorage
    const updatedProfile = response.data.user || response.data;
    await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
    
    console.log('Réponse du serveur:', response.data);
    return updatedProfile;
  } catch (error) {
    console.error('Détails de l\'erreur:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

// Comments
export const createComment = async (postId, commentData) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, commentData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur création commentaire:', error);
    throw error;
  }
};

export const fetchComments = async (postId) => {
  try {
    const token = await getAuthToken();
    console.log('Fetching comments for post:', postId);
    
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data || [];
  } catch (error) {
    if (error.message === 'No token found') {
      return []; // Retourner un tableau vide si pas de token
    }
    console.error('Erreur détaillée chargement commentaires:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return [];
  }
};

// Notifications
export const fetchNotifications = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// User Posts
export const fetchUserPosts = async (userId) => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Suppression de compte
export const deleteAccount = async () => {
  const token = await getAuthToken();
  const response = await axios.delete(`${API_URL}/user/account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Relations
export const fetchSuggestedConnections = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/connections/suggestions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendConnectionRequest = async (userId) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/connections/request`, 
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const acceptConnectionRequest = async (requestId) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/connections/accept/${requestId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const rejectConnectionRequest = async (requestId) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/connections/reject/${requestId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUserConnections = async (userId) => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/connections/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPendingRequests = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/connections/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Likes
export const likePost = async (postId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('Token non trouvé');

    console.log('Tentative de like du post:', postId);
    const response = await axios({
      method: 'post',
      url: `${API_URL}/posts/${postId}/like`,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {} // Envoyer un objet vide au lieu de null
    });

    console.log('Like réussi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée like:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/posts/${postId}/like`
    });
    throw error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('Token non trouvé');

    console.log('Tentative d\'unlike du post:', postId);
    const response = await axios({
      method: 'delete',
      url: `${API_URL}/posts/${postId}/like`,
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Unlike réussi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée unlike:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/posts/${postId}/like`
    });
    throw error;
  }
};

// Reposts
export const repostPost = async (postId) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/posts/${postId}/repost`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const unrepostPost = async (postId) => {
  const token = await getAuthToken();
  const response = await axios.delete(`${API_URL}/posts/${postId}/repost`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Partages
export const sharePost = async (postId, shareData) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/posts/${postId}/share`, shareData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Signalement
export const reportPost = async (postId, reason) => {
  const token = await getAuthToken();
  const response = await axios.post(`${API_URL}/posts/${postId}/report`, { reason }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}; 