const initialState = {
    posts: [],
    loading: false,
    error: null,
  };
  
  const postReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_POSTS":
        return { ...state, posts: action.payload };
      case "ADD_POST":
        return { ...state, posts: [...state.posts, action.payload] };
      default:
        return state;
    }
  };
  
  export default postReducer;
  