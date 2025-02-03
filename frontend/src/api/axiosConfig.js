import axios from "axios";
<<<<<<< Updated upstream

const apiClient = axios.create({
  baseURL: "https://e50c-46-193-56-215.ngrok-free.app/api", // URL du backend
  headers: {
    "Content-Type": "application/json",
  },
});

=======
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction utilitaire pour gérer les erreurs
const handleApiError = (error) => {
  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    console.error('Erreur API:', {
      status: error.response.status,
      data: error.response.data,
      url: error.config.url,
      method: error.config.method,
    });
  } else if (error.request) {
    // La requête a été faite mais pas de réponse
    console.error('Pas de réponse du serveur:', {
      url: error.config.url,
      method: error.config.method,
    });
  } else {
    // Erreur lors de la configuration de la requête
    console.error('Erreur de configuration:', error.message);
  }
  return Promise.reject(error);
};

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Log de la requête
      console.log('Requête API:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
      return config;
    } catch (error) {
      return handleApiError(error);
    }
  },
  (error) => handleApiError(error)
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => {
    // Log de la réponse
    console.log('Réponse API:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, { token });

        if (response.data.token) {
          await AsyncStorage.setItem('userToken', response.data.token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['userToken', 'user']);
        delete apiClient.defaults.headers.common['Authorization'];
        return handleApiError(refreshError);
      }
    }

    return handleApiError(error);
  }
);

>>>>>>> Stashed changes
export default apiClient;
