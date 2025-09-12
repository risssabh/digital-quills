// src/redux/blogSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    addBlog: (state, action) => {
      state.blogs.push({
        ...action.payload,
        likes: 0,
        dislikes: 0,
        votes: {},
        comments: [],
      });
    },
    editBlog: (state, action) => {
      const { blogId, title, content } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);
      if (blog) {
        blog.title = title;
        blog.content = content;
      }
    },
    likeBlog: (state, action) => {
      const { blogId, username } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);
      if (!blog) return;
      const prev = blog.votes[username];
      if (prev === "like") return;
      if (prev === "dislike") blog.dislikes = Math.max(0, blog.dislikes - 1);
      blog.likes = (blog.likes || 0) + 1;
      blog.votes[username] = "like";
    },
    dislikeBlog: (state, action) => {
      const { blogId, username } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);
      if (!blog) return;
      const prev = blog.votes[username];
      if (prev === "dislike") return;
      if (prev === "like") blog.likes = Math.max(0, blog.likes - 1);
      blog.dislikes = (blog.dislikes || 0) + 1;
      blog.votes[username] = "dislike";
    },
    addComment: (state, action) => {
      const { blogId, username, content } = action.payload;
      const blog = state.blogs.find((b) => b.id === blogId);
      if (!blog) return;
      blog.comments.push({
        id: Date.now(),
        username,
        content,
        createdAt: new Date().toLocaleString(),
      });
    },
  },
});

export const { addBlog, editBlog, likeBlog, dislikeBlog, addComment } = blogSlice.actions;
export default blogSlice.reducer;
