const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

// =========================
// Create Post
// =========================

router.post("/", authMiddleware, postController.createPost);

// =========================
// Home Feed
// =========================

router.get("/", authMiddleware, postController.getPosts);

// Get Single Post
router.get("/:postId", authMiddleware, postController.getPost);

// Update Post
router.put("/:postId", authMiddleware, postController.updatePost);

// Delete Post
router.delete("/:postId", authMiddleware, postController.deletePost);

module.exports = router;