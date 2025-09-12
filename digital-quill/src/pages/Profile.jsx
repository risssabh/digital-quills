import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getMyBlogs } from "../utils/api";
import BlogCard from "../components/BlogCard";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    let mounted = true;
    const fetchBlogs = async () => {
      try {
        // ✅ Fetch only the current user's blogs
        const res = await getMyBlogs();
        if (!mounted) return;
        setBlogs(res.data || []);
      } catch (err) {
        console.error("Error fetching profile blogs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      mounted = false;
    };
  }, [user, isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-4xl w-full mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <span className="italic brand">
            Hello, {user.firstName} {user.lastName}
          </span>
        </h1>
        <p className="text-gray-600">@{user.username}</p>
        <p className="text-gray-500 text-sm mt-2">{user.email}</p>

        <Link to="/create" className="btn btn-primary mt-4">
          Write New Blog
        </Link>
      </div>

      {/* Blogs Section */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Blogs</h2>
        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-600">You haven’t written any blogs yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
