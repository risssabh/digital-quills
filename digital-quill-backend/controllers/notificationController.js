//digital-quill-backend\controllers\notificationController.js

const Notification = require('../models/Notification');

exports.getMy = async (req, res) => {
  const list = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
};

exports.markRead = async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) return res.status(404).json({ message: 'Not found' });
  if (!n.recipient.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  n.read = true;
  await n.save();
  res.json(n);
};

exports.clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ message: "Cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
