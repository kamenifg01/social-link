export const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération commentaires:', error);
    throw error;
  }
};

export const createComment = async (postId, content) => {
  try {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Erreur création commentaire:', error);
    throw error;
  }
}; 