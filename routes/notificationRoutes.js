const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

// Get Unread Notification Count

router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);

// Get My Notifications

router.get("/", authMiddleware, notificationController.getNotifications);

// Mark All Notifications as Read

router.put("/read-all", authMiddleware, notificationController.markAllAsRead);

// Mark Notification as Read

router.put("/:id/read", authMiddleware, notificationController.markAsRead);

// Delete Notification

router.delete("/:id", authMiddleware, notificationController.deleteNotification);

module.exports = router;