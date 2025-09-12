// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actor: String, // username who caused the notification
  type: { type: String, enum: ['like','dislike','comment'], required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
