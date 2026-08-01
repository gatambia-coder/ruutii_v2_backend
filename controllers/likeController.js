const mongoose = require("mongoose");

const Like = require("../models/Like");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

// =========================
// Like a Post
// =========================

exports.likePost = async (req, res) => {

    try {

        // Validate Post ID

        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid post ID."

            });

        }

        // Check if post exists

        const post = await Post.findById(req.params.postId);

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found."

            });

        }

        // Check if already liked

        const existingLike = await Like.findOne({

            user: req.user._id,

            post: req.params.postId

        });

        if (existingLike) {

            return res.status(400).json({

                success: false,
                message: "You have already liked this post."

            });

        }

        // Create like

        const like = await Like.create({

            user: req.user._id,

            post: req.params.postId

        });

        // Create notification (don't notify yourself)

        if (post.author.toString() !== req.user._id.toString()) {

            await Notification.create({

                recipient: post.author,

                sender: req.user._id,

                type: "post_like",

                post: post._id

            });

        }

        res.status(201).json({

            success: true,

            message: "Post liked successfully.",

            like

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
// Unlike a Post
// =========================

exports.unlikePost = async (req, res) => {

    try {

        // Validate Post ID

        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid post ID."

            });

        }

        // Find the like

        const like = await Like.findOne({

            user: req.user._id,

            post: req.params.postId

        });

        if (!like) {

            return res.status(404).json({

                success: false,
                message: "Like not found."

            });

        }

        // Delete the like

        await Like.findByIdAndDelete(like._id);

        res.json({

            success: true,

            message: "Post unliked successfully."

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
// Get Like Count
// =========================

exports.getLikeCount = async (req, res) => {

    try {

        // Validate Post ID

        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid post ID."

            });

        }

        // Check if post exists

        const post = await Post.findById(req.params.postId);

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found."

            });

        }

        // Count likes

        const count = await Like.countDocuments({

            post: req.params.postId

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
// Get Users Who Liked a Post
// =========================

exports.getLikes = async (req, res) => {

    try {

        // Validate Post ID

        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid post ID."

            });

        }

        // Check if post exists

        const post = await Post.findById(req.params.postId);

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found."

            });

        }

        // Get likes

        const likes = await Like.find({

            post: req.params.postId

        }).populate(

            "user",

            "firstName lastName username profilePicture"

        );

        res.json({

            success: true,

            count: likes.length,

            users: likes.map(like => like.user)

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