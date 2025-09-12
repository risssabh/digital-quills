const router = require("express").Router();
const auth = require("../middleware/auth");
const bc = require("../controllers/blogController");

// ---------- Public Routes ----------
router.get("/", bc.getAll);
router.get("/trending", bc.trending);
router.get("/newest", bc.newest);
router.get("/most-liked", bc.mostLiked);

// Put search & me before :id
router.get("/search", bc.search);
router.get("/me", auth, bc.myBlogs);

// Get single blog (must be last among GETs)
router.get("/:id", bc.getOne);

// ---------- Protected Routes ----------
router.post("/", auth, bc.createBlog);
router.post("/:id/like", auth, bc.like);
router.post("/:id/dislike", auth, bc.dislike);
router.post("/:id/comment", auth, bc.comment);
router.put("/:id", auth, bc.updateBlog);
router.delete("/:id", auth, bc.deleteBlog);

module.exports = router;
