// src\pages\BlogDetails.jsx

import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getBlogById,
  likeBlog,
  dislikeBlog,
  addComment,
  deleteBlog,
} from "../utils/api";

export default function BlogDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchBlog() {
      try {
        const { data } = await getBlogById(id);
        if (!mounted) return;
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchBlog();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <p className="px-6 py-12">Loading blog...</p>;
  if (!blog) return <Navigate to="/explore" replace />;

  // --- Likes / Dislikes ---
  const handleLike = async () => {
    if (!isAuthenticated) return alert("Please login to like/dislike.");
    try {
      const { data } = await likeBlog(blog._id);
      setBlog(data);
    } catch (err) {
      console.error(err);
      alert("Failed to like blog");
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) return alert("Please login to like/dislike.");
    try {
      const { data } = await dislikeBlog(blog._id);
      setBlog(data);
    } catch (err) {
      console.error(err);
      alert("Failed to dislike blog");
    }
  };

  // --- Comments ---
  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please login to comment.");
    if (!commentText.trim()) return;

    try {
      const { data } = await addComment(blog._id, { content: commentText });
      setBlog(data);
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // --- Delete ---
  const confirmDelete = async () => {
    try {
      await deleteBlog(blog._id);
      navigate("/explore");
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)]">
      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="card max-w-3xl mx-auto relative w-full overflow-hidden">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl brand mb-2 break-words">
            {blog.title}
          </h1>
          <p className="small-muted mb-6 break-words">
            by{" "}
            <span className="font-semibold">{blog.author}</span> •{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          {/* Content */}
          <div className="prose prose-lg max-w-full leading-relaxed mb-8 break-words whitespace-pre-wrap">
            {blog.content}
          </div>

          {/* Likes & Dislikes */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={handleLike}
              className="btn btn-primary hover:scale-105 transition-transform"
            >
              👍 {blog.likes?.length || 0}
            </button>
            <button
              onClick={handleDislike}
              className="btn btn-secondary hover:scale-105 transition-transform"
            >
              👎 {blog.dislikes?.length || 0}
            </button>
          </div>

          {/* Edit / Delete (only author can see) */}
          {isAuthenticated && user?.username === blog.author && (
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <Link
                to={`/blog/${blog._id}/edit`}
                className="btn btn-secondary hover:scale-105 transition-transform"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-secondary hover:scale-105 transition-transform"
              >
                🗑 Delete
              </button>
            </div>
          )}

          {/* Comments */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>

            {(!blog.comments || blog.comments.length === 0) ? (
              <p className="small-muted mb-4">No comments yet.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {blog.comments.map((c) => (
                  <div
                    key={c._id || c.id || `${c.username}-${c.createdAt}`}
                    className="bg-[var(--paper)] border border-[var(--muted)]/40 rounded-lg p-3 break-words"
                  >
                    <p className="text-sm">
                      <span className="font-semibold">{c.username}</span>:{" "}
                      {c.content}
                    </p>
                    <p className="text-xs small-muted mt-1">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {isAuthenticated && (
              <form
                onSubmit={handleComment}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--muted)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] break-words"
                />
                <button
                  type="submit"
                  className="btn btn-secondary hover:scale-105 transition-transform"
                >
                  Comment
                </button>
              </form>
            )}
          </div>

          {/* Back link */}
          <div className="mt-8">
            <Link
              to="/explore"
              className="hover:underline text-[var(--accent)]"
            >
              ← Back to Explore
            </Link>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="card max-w-md w-full text-center p-6">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="small-muted mb-6 break-words">
              Are you sure you want to delete <strong>{blog.title}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={confirmDelete}
                className="btn btn-secondary hover:scale-105 transition-transform"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary hover:scale-105 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
