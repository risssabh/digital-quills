//src\pages\EditBlog.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBlogById, updateBlog } from "../utils/api";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchBlog() {
      try {
        const { data } = await getBlogById(id);
        // Only allow author to edit
        if (data.author !== user?.username && String(data.authorId) !== String(user?.id) && String(data.authorId) !== String(user?.id || user?._id)) {
          alert("You are not allowed to edit this blog.");
          navigate("/explore");
          return;
        }
        if (!mounted) return;
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error(err);
        alert("Failed to load blog.");
        navigate("/explore");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (isAuthenticated) fetchBlog();
    else setLoading(false);
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return <p className="px-6 py-12">Loading blog...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await updateBlog(id, { title, content });
      navigate(`/blog/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update blog");
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-4">
      <form onSubmit={handleSubmit} className="card max-w-3xl w-full">
        <h2 className="text-2xl mb-4 brand">Edit Blog</h2>
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
            Save Changes
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
