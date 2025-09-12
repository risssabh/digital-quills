// controllers/userController.js
const User = require("../models/User");

// search users by username, firstName, or lastName
exports.search = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    const users = await User.find({
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex }
      ],
    }).select("username firstName lastName");

    res.json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
