import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllBlogs } from "../utils/api";

export default function Explore() {
  const location = useLocation();
  const preloaded = location.state?.results || null;

  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    let mounted = true;

    if (preloaded) {
      if (Array.isArray(preloaded)) {
        // If results is just blogs array
        setBlogs(preloaded);
      } else {
        // If results contains both blogs and users
        setBlogs(preloaded.blogs || []);
        setUsers(preloaded.users || []);
      }
      setLoading(false);
      return () => (mounted = false);
    }

    async function fetchBlogs() {
      try {
        const { data } = await getAllBlogs();
        if (!mounted) return;
        setBlogs(data);
      } catch (err) {
        console.error("Failed to load blogs", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBlogs();
    return () => (mounted = false);
  }, [preloaded]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow px-6 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl brand mb-8">Explore</h1>

        {/* Users Section */}
        {users.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {users.map((u) => (
                <Link
                  to={`/profile/${u._id}`}
                  key={u._id}
                  className="card hover:bg-[#fdfaf6] transition block p-4"
                >
                  <h3 className="text-xl font-semibold mb-1">
                    {u.firstName} {u.lastName}
                  </h3>
                  <p className="small-muted">@{u.username}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        <h2 className="text-2xl font-semibold mb-4">Blogs</h2>
        {loading ? (
          <p className="small-muted">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="small-muted">No blogs found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                to={`/blog/${blog._id}`}
                key={blog._id}
                className="card hover:bg-[#fdfaf6] transition block h-full overflow-hidden"
              >
                <h2 className="text-2xl font-semibold mb-2 line-clamp-2 break-words">
                  {blog.title}
                </h2>
                <p className="small-muted mb-3 break-words">
                  by {blog.author?.username || blog.author} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-[#3e2c1c] line-clamp-3 break-words">
                  {blog.content}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
