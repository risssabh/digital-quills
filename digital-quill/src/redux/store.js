//src\redux\store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import blogReducer from "./blogSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
  },
});

// persist state changes
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("authState", JSON.stringify(state.auth));
});
