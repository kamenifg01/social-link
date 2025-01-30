import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  comments: {},
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess(state, action) {
      state.loading = false;
      state.posts = action.payload;
    },
    fetchPostsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addPost(state, action) {
      state.posts.push(action.payload);
    },
    removePost(state, action) {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    addComment(state, action) {
      const { postId, comment } = action.payload;
      if (!state.comments[postId]) {
        state.comments[postId] = [];
      }
      state.comments[postId].push(comment);
    },
    updateComment(state, action) {
      const { postId, commentId, content } = action.payload;
      const comments = state.comments[postId];
      if (comments) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.content = content;
        }
      }
    },
    removeComment(state, action) {
      const { postId, commentId } = action.payload;
      const comments = state.comments[postId];
      if (comments) {
        state.comments[postId] = comments.filter(c => c.id !== commentId);
      }
    },
  },
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, addPost, removePost, addComment, updateComment, removeComment } = postSlice.actions;

export default postSlice.reducer; 