<<<<<<< Updated upstream
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilisez l'adresse IP de votre machine sur le réseau local
const API_URL = "https://e50c-46-193-56-215.ngrok-free.app/api";  // Remplacez X par le dernier numéro de votre IP
=======
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/axiosConfig';
import { API_URL } from '../config/api';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      token: currentToken,
    });
    const newToken = response.data.token;
    await AsyncStorage.setItem('token', newToken);
=======
    const response = await apiClient.post('/auth/refresh', {
      token: currentToken,
    });
    const newToken = response.data.token;
    await AsyncStorage.setItem('userToken', newToken);
>>>>>>> Stashed changes
    return newToken;
  } catch (error) {
    throw error;
  }
};

// Authentification
export const login = async (email, password) => {
<<<<<<< Updated upstream
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const signUp = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
  return response.data;
=======
  try {
    console.log('Tentative de connexion avec:', { email });
    const response = await apiClient.post('/auth/login', { email, password });
    console.log('Réponse login:', response.data);
    
    if (response.data.token && response.data.user) {
      await AsyncStorage.multiSet([
        ['userToken', response.data.token],
        ['user', JSON.stringify(response.data.user)]
      ]);
      
      // Configurer le token pour les futures requêtes
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur login:', error.response?.data || error.message);
    throw error;
  }
};

export const signUp = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/signup', { email, password });
    return response.data;
  } catch (error) {
    console.error('Erreur signup:', error.response?.data || error.message);
    throw error;
  }
>>>>>>> Stashed changes
};

// Posts
export const fetchPosts = async () => {
  try {
    const token = await getAuthToken();
    console.log('Appel API feed - URL:', `${API_URL}/posts/feed`);
    
<<<<<<< Updated upstream
    const response = await axios.get(`${API_URL}/posts/feed`, {
=======
    const response = await apiClient.get('/posts/feed', {
>>>>>>> Stashed changes
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
<<<<<<< Updated upstream
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
=======
    // Récupérer les réactions pour chaque post en une seule fois
    const postsWithReactions = await Promise.all(
      response.data.map(async (post) => {
        const reactionsResponse = await apiClient.get(`/posts/${post.id}/reactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Calculer le nombre total de réactions
        const totalReactions = Object.values(reactionsResponse.data.reactions)
          .reduce((sum, users) => sum + users.length, 0);
        
        return {
          ...post,
          reactions: reactionsResponse.data.reactions,
          currentUserReaction: reactionsResponse.data.currentUserReaction,
          totalReactions
        };
      })
    );
    
    return postsWithReactions;
  } catch (error) {
    if (error.message === 'No token found') {
      return [];
    }
    console.error('Erreur détaillée du feed:', error);
>>>>>>> Stashed changes
    throw error;
  }
};

<<<<<<< Updated upstream
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
=======
export const createPost = async (formData) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
>>>>>>> Stashed changes
    throw error;
  }
};

export const updatePost = async (postId, updatedData) => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.put(`${API_URL}/posts/${postId}`, updatedData, {
=======
  const response = await apiClient.put(`/posts/${postId}`, updatedData, {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePost = async (postId) => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.delete(`${API_URL}/posts/${postId}`, {
=======
  const response = await apiClient.delete(`/posts/${postId}`, {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// User
export const fetchProfile = async () => {
  try {
    const token = await getAuthToken();
<<<<<<< Updated upstream
    const response = await axios.get(`${API_URL}/user/profile`, {
=======
    const response = await apiClient.get('/user/profile', {
>>>>>>> Stashed changes
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
    
<<<<<<< Updated upstream
    const response = await axios.put(`${API_URL}/user/profile`, profileData, {
=======
    const response = await apiClient.put('/user/profile', profileData, {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
export const createComment = async (postId, content) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.post(
      `/posts/${postId}/comments`,
      { content },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
>>>>>>> Stashed changes
    return response.data;
  } catch (error) {
    console.error('Erreur création commentaire:', error);
    throw error;
  }
};

export const fetchComments = async (postId) => {
  try {
    const token = await getAuthToken();
<<<<<<< Updated upstream
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
=======
    const response = await apiClient.get(
      `/posts/${postId}/comments`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur chargement commentaires:', error);
>>>>>>> Stashed changes
    return [];
  }
};

// Notifications
export const fetchNotifications = async () => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.get(`${API_URL}/notifications`, {
=======
  const response = await apiClient.get('/notifications', {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// User Posts
export const fetchUserPosts = async (userId) => {
<<<<<<< Updated upstream
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
=======
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/posts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Récupérer les réactions pour chaque post en une seule fois
    const postsWithReactions = await Promise.all(
      response.data.map(async (post) => {
        const reactionsResponse = await apiClient.get(`/posts/${post.id}/reactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Calculer le nombre total de réactions
        const totalReactions = Object.values(reactionsResponse.data.reactions)
          .reduce((sum, users) => sum + users.length, 0);
        
        return {
          ...post,
          reactions: reactionsResponse.data.reactions,
          currentUserReaction: reactionsResponse.data.currentUserReaction,
          totalReactions
        };
      })
    );
    
    return postsWithReactions;
  } catch (error) {
    console.error('Erreur récupération posts utilisateur:', error);
    throw error;
  }
>>>>>>> Stashed changes
};

// Suppression de compte
export const deleteAccount = async () => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.delete(`${API_URL}/user/account`, {
=======
  const response = await apiClient.delete('/user/account', {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Relations
export const fetchSuggestedConnections = async () => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.get(`${API_URL}/connections/suggestions`, {
=======
  const response = await apiClient.get('/connections/suggestions', {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendConnectionRequest = async (userId) => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.post(`${API_URL}/connections/request`, 
=======
  const response = await apiClient.post('/connections/request', 
>>>>>>> Stashed changes
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const acceptConnectionRequest = async (requestId) => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.post(`${API_URL}/connections/accept/${requestId}`, {}, {
=======
  const response = await apiClient.post(`/connections/accept/${requestId}`, {}, {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const rejectConnectionRequest = async (requestId) => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.post(`${API_URL}/connections/reject/${requestId}`, {}, {
=======
  const response = await apiClient.post(`/connections/reject/${requestId}`, {}, {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUserConnections = async (userId) => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.get(`${API_URL}/connections/user/${userId}`, {
=======
  const response = await apiClient.get(`/connections/user/${userId}`, {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPendingRequests = async () => {
  const token = await getAuthToken();
<<<<<<< Updated upstream
  const response = await axios.get(`${API_URL}/connections/pending`, {
=======
  const response = await apiClient.get('/connections/pending', {
>>>>>>> Stashed changes
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

<<<<<<< Updated upstream
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
=======
// Likes et Réactions
export const getPostReactions = async (postId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/posts/${postId}/reactions`, {
      headers: {
>>>>>>> Stashed changes
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

<<<<<<< Updated upstream
    console.log('Unlike réussi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée unlike:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${API_URL}/posts/${postId}/like`
    });
=======
    if (response.data) {
      const { reactions = {}, currentUserReaction = null } = response.data;
      // Calculer le nombre total de réactions
      const totalReactions = Object.values(reactions)
        .reduce((sum, users) => sum + (Array.isArray(users) ? users.length : 0), 0);
      
      console.log(`Réactions pour le post ${postId}:`, {
        reactions,
        currentUserReaction,
        totalReactions
      });
      
      return {
        reactions,
        currentUserReaction,
        totalReactions
      };
    }

    return {
      reactions: {},
      currentUserReaction: null,
      totalReactions: 0
    };
  } catch (error) {
    console.error('Erreur récupération réactions:', error);
    return {
      reactions: {},
      currentUserReaction: null,
      totalReactions: 0
    };
  }
};

export const toggleReaction = async (postId, reactionType = 'like') => {
  try {
    const token = await getAuthToken();
    
    // Récupérer l'état actuel des réactions
    const currentState = await getPostReactions(postId);
    const hasReaction = currentState.currentUserReaction === reactionType;
    
    console.log('État actuel:', {
      postId,
      reactionType,
      hasReaction,
      currentState
    });

    // Utiliser l'endpoint /reactions avec l'action appropriée
    const response = await apiClient.post(
      `/posts/${postId}/reactions`,
      { 
        reactionType,
        action: hasReaction ? 'remove' : 'add'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data) {
      // Mettre à jour le cache local avec les nouvelles données
      const updatedState = {
        ...currentState,
        currentUserReaction: hasReaction ? null : reactionType,
        totalReactions: hasReaction 
          ? Math.max(0, currentState.totalReactions - 1)
          : currentState.totalReactions + 1,
        reactions: response.data.reactions || currentState.reactions
      };

      console.log('État mis à jour:', updatedState);
      return updatedState;
    }

    return currentState;
  } catch (error) {
    console.error('Erreur toggle réaction:', error);
>>>>>>> Stashed changes
    throw error;
  }
};

<<<<<<< Updated upstream
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
=======
// Fonctions simplifiées pour la compatibilité
export const likePost = (postId) => toggleReaction(postId, 'like');
export const unlikePost = (postId) => toggleReaction(postId, 'like');

// Reposts
export const repostPost = async (postId) => {
  const token = await getAuthToken();
  const response = await apiClient.post(`/posts/${postId}/repost`, {}, {
    headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
>>>>>>> Stashed changes
