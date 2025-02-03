export const setPosts = (posts) => ({
    type: "SET_POSTS",
    payload: posts,
  });
  
  export const addPost = (post) => ({
    type: "ADD_POST",
    payload: post,
  });
  
  export const fetchPosts = () => {
    return async (dispatch) => {
      
      // Implémentez la logique pour récupérer les posts
    };
  };
  
  export const createPost = (post) => {
    return async (dispatch) => {
      // Implémentez la logique pour créer un post
    };
  };
  