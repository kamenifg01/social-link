const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    // Ajoutez des cas pour les actions ici
    default:
      return state;
  }
};

export default notificationReducer; 