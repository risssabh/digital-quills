import axios from "axios";

// Base URL (switches automatically for dev/prod)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// 🔹 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// ---------- AUTH ----------
export const registerUser = (userData) =>
  API.post("/auth/register", userData);

export const loginUser = (credentials) =>
  API.post("/auth/login", credentials);
// ---------- BLOGS ----------
export const getAllBlogs = () => API.get("/blogs");
export const getBlogById = (id) => API.get(`/blogs/${id}`);
export const createBlog = (blogData) => API.post("/blogs", blogData);
export const updateBlog = (id, blogData) => API.put(`/blogs/${id}`, blogData);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// my blogs (for profile)
export const getMyBlogs = () => API.get("/blogs/me");

// 🔹 Reactions
export const likeBlog = (id) => API.post(`/blogs/${id}/like`, {});
export const dislikeBlog = (id) => API.post(`/blogs/${id}/dislike`, {});

// 🔹 Comments
export const addComment = (id, commentData) =>
  API.post(`/blogs/${id}/comment`, commentData);

// 🔹 Special blog lists
export const getTrending = () => API.get("/blogs/trending");
export const getNewest = () => API.get("/blogs/newest");
export const getMostLiked = () => API.get("/blogs/most-liked");

// 🔹 Search blogs
export const searchBlogs = (q) =>
  API.get(`/blogs/search?q=${encodeURIComponent(q)}`);

// ---------- USERS ----------
export const searchUsers = (q) =>
  API.get(`/users/search?q=${encodeURIComponent(q)}`);

// ---------- NOTIFICATIONS ----------
export const getNotifications = () => API.get("/notifications");
export const markNotificationRead = (id) =>
  API.put(`/notifications/${id}/read`, {});
export const clearAllNotifications = () => API.delete("/notifications/clear");

export default API;
