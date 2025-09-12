import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <article className="card hover:shadow-xl transition flex flex-col h-full">
      <Link to={`/blog/${blog._id}`} className="flex flex-col flex-grow overflow-hidden">
        <h3 className="text-xl font-semibold break-words line-clamp-2">
          {blog.title}
        </h3>
        <p className="small-muted mt-2 line-clamp-3 break-words">
          {blog.content}
        </p>
      </Link>
      <div className="mt-4 flex justify-between items-center text-sm flex-wrap gap-2">
        <div className="small-muted">
          By <strong>{blog.author?.username || blog.author}</strong> •{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </div>
        <div className="text-sm small-muted">
          👍 {blog.likes?.length || 0} • 👎 {blog.dislikes?.length || 0}
        </div>
      </div>
    </article>
  );
}
