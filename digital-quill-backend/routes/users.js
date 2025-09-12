const router = require("express").Router();
const User = require("../models/User");

// 🔹 Search users by username, firstName, lastName
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const regex = new RegExp(q, "i");
    const users = await User.find({
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex },
      ],
    }).select("username firstName lastName email");
    res.json(users);
  } catch (err) {
    console.error("User search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
