const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

// =========================
// Send Friend Request
// =========================

exports.sendFriendRequest = async (req, res) => {

    try {

        const senderId = req.user._id;
        const { receiverId } = req.body;

        // Cannot send request to yourself
        if (senderId.toString() === receiverId) {

            return res.status(400).json({
                success: false,
                message: "You cannot send a friend request to yourself."
            });

        }

        // Check receiver exists
        const receiver = await User.findById(receiverId);

        if (!receiver) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        // Check if already friends
        if (receiver.friends.includes(senderId)) {

            return res.status(400).json({
                success: false,
                message: "You are already friends."
            });

        }

        // Check if request already exists
        const existingRequest = await FriendRequest.findOne({

            sender: senderId,
            receiver: receiverId,
            status: "pending"

        });

        if (existingRequest) {

            return res.status(400).json({
                success: false,
                message: "Friend request already sent."
            });

        }

        const request = await FriendRequest.create({

            sender: senderId,
            receiver: receiverId

        });

        // Create notification

        await Notification.create({

            recipient: receiverId,

            sender: req.user._id,

            type: "friend_request"

        });

        res.status(201).json({

            success: true,
            message: "Friend request sent successfully.",
            request

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
// Accept Friend Request
// =========================

exports.acceptFriendRequest = async (req, res) => {

    try {

        const requestId = req.params.requestId;

        const request = await FriendRequest.findById(requestId);

        if (!request) {

            return res.status(404).json({

                success: false,
                message: "Friend request not found."

            });

        }

        // Only receiver can accept

        if (request.receiver.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        if (request.status !== "pending") {

            return res.status(400).json({

                success: false,
                message: "Request already processed."

            });

        }

        request.status = "accepted";

        await request.save();

        // Add each user to the other's friends list

        await User.findByIdAndUpdate(

            request.sender,

            {

                $addToSet: {

                    friends: request.receiver

                }

            }

        );

        // Notify sender that request was accepted

        await Notification.create({

            recipient: request.sender,

            sender: request.receiver,

            type: "friend_request_accepted"

        });

        await User.findByIdAndUpdate(

            request.receiver,

            {

                $addToSet: {

                    friends: request.sender

                }

            }

        );

        res.json({

            success: true,
            message: "Friend request accepted."

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
// Get Incoming Friend Requests
// =========================

exports.getIncomingRequests = async (req, res) => {

    try {

        const requests = await FriendRequest.find({

            receiver: req.user._id,
            status: "pending"

        })

        .populate(
            "sender",
            "firstName lastName username profilePicture"
        )

        .sort({
            createdAt: -1
        });

        res.json({

            success: true,
            count: requests.length,
            requests

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
// Reject Friend Request
// =========================

exports.rejectFriendRequest = async (req, res) => {

    try {

        const request = await FriendRequest.findById(
            req.params.requestId
        );

        if (!request) {

            return res.status(404).json({
                success: false,
                message: "Friend request not found."
            });

        }

        // Only the receiver can reject
        if (request.receiver.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized."
            });

        }

        if (request.status !== "pending") {

            return res.status(400).json({
                success: false,
                message: "Request already processed."
            });

        }

        request.status = "rejected";

        await request.save();

        res.json({

            success: true,
            message: "Friend request rejected."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server error."

        });

    }

};

// =========================
// Get Sent Friend Requests
// =========================

exports.getSentRequests = async (req, res) => {

    try {

        const requests = await FriendRequest.find({

            sender: req.user._id,
            status: "pending"

        })

        .populate(
            "receiver",
            "firstName lastName username profilePicture"
        )

        .sort({
            createdAt: -1
        });

        res.json({

            success: true,
            count: requests.length,
            requests

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
// Cancel Friend Request
// =========================

exports.cancelFriendRequest = async (req, res) => {

    try {

        const request = await FriendRequest.findOne({

            _id: req.params.requestId,
            sender: req.user._id,
            status: "pending"

        });

        if (!request) {

            return res.status(404).json({

                success: false,
                message: "Friend request not found."

            });

        }

        await request.deleteOne();

        res.json({

            success: true,
            message: "Friend request cancelled."

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
// Get Friends List
// =========================

exports.getFriends = async (req, res) => {

    try {

        const requests = await FriendRequest.find({

            status: "accepted",

            $or: [

                { sender: req.user._id },

                { receiver: req.user._id }

            ]

        })

        .populate(
            "sender",
            "firstName lastName username profilePicture"
        )

        .populate(
            "receiver",
            "firstName lastName username profilePicture"
        );

        const friends = requests.map(request => {

            if (
                request.sender._id.toString() ===
                req.user._id.toString()
            ) {

                return request.receiver;

            }

            return request.sender;

        });

        res.json({

            success: true,

            count: friends.length,

            friends

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
// Remove Friend
// =========================

exports.removeFriend = async (req, res) => {

    try {

        const friendship = await FriendRequest.findOne({

            status: "accepted",

            $or: [

                {
                    sender: req.user._id,
                    receiver: req.params.friendId
                },

                {
                    sender: req.params.friendId,
                    receiver: req.user._id
                }

            ]

        });

        if (!friendship) {

            return res.status(404).json({

                success: false,
                message: "Friend not found."

            });

        }

        await friendship.deleteOne();

        res.json({

            success: true,
            message: "Friend removed successfully."

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