// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    // Your reducers go here (e.g., user, chat, etc.)
    user: userReducer,
  },
});

export default store;