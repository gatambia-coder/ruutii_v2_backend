const Notification = require("../models/Notification");

// =========================
// Get My Notifications
// =========================

exports.getNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({

            recipient: req.user._id

        })

        .populate(

            "sender",

            "firstName lastName username profilePicture"

        )

        .populate(

            "post",

            "text"

        )

        .populate(

            "comment",

            "text"

        )

        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            count: notifications.length,

            notifications

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
// Get Unread Notification Count
// =========================

exports.getUnreadCount = async (req, res) => {

    try {

        const count = await Notification.countDocuments({

            recipient: req.user._id,

            isRead: false

        });

        res.json({

            success: true,

            count

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
// Mark Notification as Read
// =========================

exports.markAsRead = async (req, res) => {

    try {

        const notification = await Notification.findOne({

            _id: req.params.id,

            recipient: req.user._id

        });

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

            });

        }

        notification.isRead = true;

        await notification.save();

        res.json({

            success: true,

            message: "Notification marked as read.",

            notification

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
// Mark All Notifications as Read
// =========================

exports.markAllAsRead = async (req, res) => {

    try {

        const result = await Notification.updateMany(

            {

                recipient: req.user._id,

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

            message: "All notifications marked as read.",

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
// Delete Notification
// =========================

exports.deleteNotification = async (req, res) => {

    try {

        const notification = await Notification.findOne({

            _id: req.params.id,

            recipient: req.user._id

        });

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

            });

        }

        await notification.deleteOne();

        res.json({

            success: true,

            message: "Notification deleted successfully."

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