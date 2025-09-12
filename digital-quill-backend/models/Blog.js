const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  author: { type: String, required: true }, // cached username
  authorFullName: { type: String },
  createdAt: { type: Date, default: Date.now },
  // changed to arrays so controller can push/pop ObjectIds
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  comments: { type: [commentSchema], default: [] }
});

module.exports = mongoose.model('Blog', blogSchema);
