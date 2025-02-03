import axios from 'axios';
import { API_URL } from '../config';

export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/user/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche des utilisateurs:', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

export const searchPosts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/posts/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche des posts:', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}; 