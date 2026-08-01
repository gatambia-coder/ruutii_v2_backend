const express = require("express");

const router = express.Router();

const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// =========================
// Add Comment
// =========================

// Get Comments for a Post

router.get("/:postId/count", authMiddleware, commentController.getCommentCount);

// Get Replies
router.get("/reply/:commentId", authMiddleware, commentController.getReplies);

router.post("/reply/:commentId", authMiddleware, commentController.replyToComment);

router.get("/:postId", authMiddleware, commentController.getComments);

router.post("/:postId", authMiddleware, commentController.addComment);

router.put("/:commentId", authMiddleware, commentController.updateComment);

router.delete("/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;