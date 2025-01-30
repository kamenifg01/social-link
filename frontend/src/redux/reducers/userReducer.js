const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Ajoutez des cas pour les actions ici
    default:
      return state;
  }
};

export default userReducer; 