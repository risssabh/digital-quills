const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");
const Notification = require("../models/Notification"); // used for notifications

// Helper: safe id string
function userIdString(req) {
  // req.user may be a mongoose doc; prefer _id
  return req.user && (req.user._id ? String(req.user._id) : String(req.user.id || req.user));
}

// Validate ObjectId param
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all blogs
exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("authorId", "username firstName lastName").sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get blogs by current user
exports.myBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id })
      .populate("authorId", "username firstName lastName")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("My blogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get trending blogs (most likes, recent first)
exports.trending = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("authorId", "username firstName lastName");
    blogs.sort((a, b) => {
      const la = (a.likes && a.likes.length) || 0;
      const lb = (b.likes && b.likes.length) || 0;
      if (lb !== la) return lb - la;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.json(blogs.slice(0, 10));
  } catch (err) {
    console.error("Trending error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get newest blogs
exports.newest = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("authorId", "username firstName lastName").sort({ createdAt: -1 }).limit(10);
    res.json(blogs);
  } catch (err) {
    console.error("Newest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get most liked blogs
exports.mostLiked = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("authorId", "username firstName lastName");
    blogs.sort((a, b) => {
      const la = (a.likes && a.likes.length) || 0;
      const lb = (b.likes && b.likes.length) || 0;
      return lb - la;
    });
    res.json(blogs.slice(0, 10));
  } catch (err) {
    console.error("Most liked error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Search blogs
exports.search = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");

    let blogs = await Blog.find({
      $or: [{ title: regex }, { content: regex }],
    }).populate("authorId", "username firstName lastName");

    if ((!blogs || blogs.length === 0)) {
      // try match user by username
      const user = await User.findOne({ username: regex });
      if (user) {
        blogs = await Blog.find({ authorId: user._id }).populate("authorId", "username firstName lastName");
      }
    }

    res.json(blogs);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single blog
exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await Blog.findById(id).populate("authorId", "username firstName lastName");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("Get one blog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Title and content are required" });

    const blog = new Blog({
      title,
      content,
      authorId: req.user._id,
      author: req.user.username,
      authorFullName: `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim(),
    });

    await blog.save();
    const populated = await Blog.findById(blog._id).populate("authorId", "username firstName lastName");
    res.status(201).json(populated);
  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Like blog (toggle, prevents multiple) + notification
exports.like = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = userIdString(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    blog.likes = blog.likes || [];
    blog.dislikes = blog.dislikes || [];

    const liked = blog.likes.some((x) => String(x) === userId);
    const disliked = blog.dislikes.some((x) => String(x) === userId);

    if (liked) {
      // remove like (toggle off)
      blog.likes = blog.likes.filter((x) => String(x) !== userId);
    } else {
      // add like
      blog.likes.push(req.user._id);
      if (disliked) {
        blog.dislikes = blog.dislikes.filter((x) => String(x) !== userId);
      }

      // create notification (only if actor !== author)
      try {
        if (String(blog.authorId) !== String(userId)) {
          await Notification.create({
            recipient: blog.authorId,
            actor: req.user.username,
            type: "like",
            blog: blog._id,
            message: `${req.user.username} liked your blog "${blog.title}"`,
          });
        }
      } catch (nErr) {
        console.error("Notification create failed (like):", nErr);
      }
    }

    await blog.save();

    const populated = await Blog.findById(blog._id).populate("authorId", "username firstName lastName");
    res.json(populated);
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Dislike blog (toggle, prevents multiple) + notification
exports.dislike = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = userIdString(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    blog.likes = blog.likes || [];
    blog.dislikes = blog.dislikes || [];

    const disliked = blog.dislikes.some((x) => String(x) === userId);
    const liked = blog.likes.some((x) => String(x) === userId);

    if (disliked) {
      blog.dislikes = blog.dislikes.filter((x) => String(x) !== userId);
    } else {
      blog.dislikes.push(req.user._id);
      if (liked) {
        blog.likes = blog.likes.filter((x) => String(x) !== userId);
      }

      // notification (only if actor !== author)
      try {
        if (String(blog.authorId) !== String(userId)) {
          await Notification.create({
            recipient: blog.authorId,
            actor: req.user.username,
            type: "dislike",
            blog: blog._id,
            message: `${req.user.username} disliked your blog "${blog.title}"`,
          });
        }
      } catch (nErr) {
        console.error("Notification create failed (dislike):", nErr);
      }
    }

    await blog.save();

    const populated = await Blog.findById(blog._id).populate("authorId", "username firstName lastName");
    res.json(populated);
  } catch (err) {
    console.error("Dislike error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Comment + notification
exports.comment = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const content = req.body.content?.trim();
    if (!content) return res.status(400).json({ message: "Comment cannot be empty" });

    blog.comments = blog.comments || [];
    blog.comments.push({
      username: req.user.username,
      userId: req.user._id,
      content,
      createdAt: new Date(),
    });

    await blog.save();

    // create notification only if actor != author
    try {
      if (String(blog.authorId) !== String(req.user._id)) {
        await Notification.create({
          recipient: blog.authorId,
          actor: req.user.username,
          type: "comment",
          blog: blog._id,
          message: `${req.user.username} commented on your blog "${blog.title}"`,
        });
      }
    } catch (nErr) {
      console.error("Notification create failed (comment):", nErr);
    }

    const populated = await Blog.findById(blog._id).populate("authorId", "username firstName lastName");
    res.json(populated);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // allow only owner to update
    if (String(blog.authorId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allowed = {};
    if (typeof req.body.title === "string") allowed.title = req.body.title;
    if (typeof req.body.content === "string") allowed.content = req.body.content;

    Object.assign(blog, allowed);
    await blog.save();

    const populated = await Blog.findById(blog._id).populate("authorId", "username firstName lastName");
    res.json(populated);
  } catch (err) {
    console.error("Update blog error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid blog id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (String(blog.authorId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("Delete blog error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
