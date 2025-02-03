import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
<<<<<<< Updated upstream

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
=======
import postReducer from './postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
>>>>>>> Stashed changes
});

export default store;
