const express = require("express");

const router = express.Router();

const friendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

// Send Friend Request
router.post("/request", authMiddleware, friendController.sendFriendRequest);

// Accept Friend Request
router.put("/accept/:requestId", authMiddleware, friendController.acceptFriendRequest);

// Reject Friend Request
router.put("/reject/:requestId", authMiddleware, friendController.rejectFriendRequest);

router.delete("/cancel/:requestId", authMiddleware, friendController.cancelFriendRequest);

// Get Incoming Friend Requests
router.get("/requests", authMiddleware, friendController.getIncomingRequests);

// Get Sent Friend Requests
router.get("/sent", authMiddleware, friendController.getSentRequests);

// Get Friends List
router.get("/", authMiddleware, friendController.getFriends);

// Remove Friend
router.delete("/:friendId", authMiddleware, friendController.removeFriend);

module.exports = router;