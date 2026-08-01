const express = require("express");

const router = express.Router();

const likeController = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

// =========================
// Like a Post
// =========================

// Get Like Count
router.get("/:postId/count", authMiddleware, likeController.getLikeCount);

// Get Users Who Liked a Post
router.get("/:postId", authMiddleware, likeController.getLikes);

router.post("/:postId", authMiddleware, likeController.likePost);

// Unlike a Post
router.delete("/:postId", authMiddleware, likeController.unlikePost);

module.exports = router;