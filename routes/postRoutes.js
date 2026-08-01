const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");
const upload = require("../middleware/postUploadMiddleware");

// =========================
// Create Post
// =========================

router.post("/", authMiddleware, upload.array("attachments", 20), postController.createPost);

router.put("/:postId", authMiddleware, postController.updatePost);
// =========================
// Home Feed
// =========================

router.get("/", authMiddleware, postController.getPosts);

// Get Single Post
router.get("/:postId", authMiddleware, postController.getPost);

// Update Post
router.put("/:postId", authMiddleware, postController.updatePost);

// Delete one attachment
router.delete(
    "/:postId/attachments/:attachmentIndex",
    authMiddleware,
    postController.deleteAttachment
);

// Delete Post
router.delete("/:postId", authMiddleware, postController.deletePost);

module.exports = router;