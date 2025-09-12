//src\pages\CreateBlog.jsx

import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { createBlog } from "../utils/api";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { isAuthenticated, user, token } = useSelector((s) => s.auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await createBlog(
        { title, content, author: user.username },
        token
      );
      navigate("/explore");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish blog");
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <form onSubmit={handleSubmit} className="card max-w-3xl w-full">
        <h2 className="text-2xl mb-4 brand">Write a New Blog</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full mb-3 px-3 py-2 border rounded-md"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="12"
          placeholder="Your story..."
          className="w-full mb-4 px-3 py-2 border rounded-md"
        ></textarea>
        <div className="flex gap-3">
          <button className="btn btn-primary" type="submit">
            Publish
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
