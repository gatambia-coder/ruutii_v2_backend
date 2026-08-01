const mongoose = require("mongoose");

const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");

// =========================
// Send Message
// =========================

exports.sendMessage = async (req, res) => {

    try {

        const senderId = req.user._id;
        const { receiverId, text } = req.body;

        // Validate receiver ID

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid receiver ID."

            });

        }

        // Cannot message yourself

        if (senderId.toString() === receiverId) {

            return res.status(400).json({

                success: false,
                message: "You cannot message yourself."

            });

        }

        // Check receiver exists

        const receiver = await User.findById(receiverId);

        if (!receiver) {

            return res.status(404).json({

                success: false,
                message: "Receiver not found."

            });

        }

        // Validate message

        if (!text || text.trim() === "") {

            return res.status(400).json({

                success: false,
                message: "Message cannot be empty."

            });

        }

        // Create message

        const message = await Message.create({

            sender: senderId,
            receiver: receiverId,
            text: text.trim()

        });

        await message.populate(

            "sender",

            "firstName lastName username profilePicture"

        );

        // Create notification

        await Notification.create({

            recipient: receiverId,
            sender: senderId,
            type: "message"

        });

        res.status(201).json({

            success: true,
            message: "Message sent successfully.",
            data: message

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server error."

        });

    }

};

// =========================
// Get Conversation
// =========================

exports.getConversation = async (req, res) => {

    try {

        const otherUserId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid user ID."

            });

        }

        const messages = await Message.find({

            $or: [

                {

                    sender: req.user._id,

                    receiver: otherUserId

                },

                {

                    sender: otherUserId,

                    receiver: req.user._id

                }

            ]

        })

        .populate(

            "sender",

            "firstName lastName username profilePicture"

        )

        .populate(

            "receiver",

            "firstName lastName username profilePicture"

        )

        .sort({

            createdAt: 1

        });

        res.json({

            success: true,

            count: messages.length,

            messages

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

};

// =========================
// Mark Messages as Read
// =========================

exports.markAsRead = async (req, res) => {

    try {

        const otherUserId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid user ID."

            });

        }

        const result = await Message.updateMany(

            {

                sender: otherUserId,

                receiver: req.user._id,

                isRead: false

            },

            {

                $set: {

                    isRead: true

                }

            }

        );

        res.json({

            success: true,

            message: "Messages marked as read.",

            modifiedCount: result.modifiedCount

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

};

// =========================
// Get Conversation List
// =========================

exports.getConversationList = async (req, res) => {

    try {

        const userId = req.user._id;

        const messages = await Message.find({

            $or: [

                { sender: userId },

                { receiver: userId }

            ]

        })

        .populate(

            "sender",

            "firstName lastName username profilePicture"

        )

        .populate(

            "receiver",

            "firstName lastName username profilePicture"

        )

        .sort({

            createdAt: -1

        });

        const conversations = new Map();

        messages.forEach(message => {

            const otherUser =

                message.sender._id.toString() === userId.toString()

                ? message.receiver

                : message.sender;

            if (!conversations.has(otherUser._id.toString())) {

                conversations.set(

                    otherUser._id.toString(),

                    {

                        user: otherUser,

                        lastMessage: message,

                        unread:

                            !message.isRead &&

                            message.receiver._id.toString() === userId.toString()

                    }

                );

            }

        });

        res.json({

            success: true,

            count: conversations.size,

            conversations: [...conversations.values()]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

};