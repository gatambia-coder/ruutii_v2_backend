const express = require("express");

const router = express.Router();

const messageController = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

// Send Message

router.post(

    "/send",

    authMiddleware,

    messageController.sendMessage

);

// Get Conversation

router.get(

    "/conversation/:userId",

    authMiddleware,

    messageController.getConversation

);

// Mark Conversation as Read

router.put(

    "/read/:userId",

    authMiddleware,

    messageController.markAsRead

);

// Conversation List

router.get(

    "/",

    authMiddleware,

    messageController.getConversationList

);

module.exports = router;