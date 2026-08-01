const mongoose = require("mongoose");

const Comment = require("../models/Comment");
const Post = require("../models/Post");

// =========================
// Add Comment
// =========================

exports.addComment = async (req, res) => {

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

        // Validate comment text

        if (!req.body.text || req.body.text.trim() === "") {

            return res.status(400).json({

                success: false,
                message: "Comment text is required."

            });

        }

        // Create comment

        const comment = await Comment.create({

            author: req.user._id,

            post: req.params.postId,

            text: req.body.text.trim()

        });

        // Populate author information

        await comment.populate(

            "author",

            "firstName lastName username profilePicture"

        );

        res.status(201).json({

            success: true,

            message: "Comment added successfully.",

            comment

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
// Get Comments for a Post
// =========================

exports.getComments = async (req, res) => {

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

        // Get comments

        const comments = await Comment.find({

            post: req.params.postId

        })

        .populate(

            "author",

            "firstName lastName username profilePicture"

        )

        .sort({

            createdAt: 1

        });

        res.json({

            success: true,

            count: comments.length,

            comments

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
// Update Comment
// =========================

exports.updateComment = async (req, res) => {

    try {

        // Validate Comment ID

        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid comment ID."

            });

        }

        // Find comment

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({

                success: false,
                message: "Comment not found."

            });

        }

        // Check ownership

        if (comment.author.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,
                message: "You are not allowed to edit this comment."

            });

        }

        // Validate text

        if (!req.body.text || req.body.text.trim() === "") {

            return res.status(400).json({

                success: false,
                message: "Comment text is required."

            });

        }

        // Update

        comment.text = req.body.text.trim();

        await comment.save();

        await comment.populate(

            "author",

            "firstName lastName username profilePicture"

        );

        res.json({

            success: true,

            message: "Comment updated successfully.",

            comment

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
// Delete Comment
// =========================

exports.deleteComment = async (req, res) => {

    try {

        // Validate Comment ID

        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid comment ID."

            });

        }

        // Find comment

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({

                success: false,
                message: "Comment not found."

            });

        }

        // Check ownership

        if (comment.author.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,
                message: "You are not allowed to delete this comment."

            });

        }

        // Delete comment

        await Comment.findByIdAndDelete(comment._id);

        res.json({

            success: true,

            message: "Comment deleted successfully."

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
// Get Comment Count
// =========================

exports.getCommentCount = async (req, res) => {

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

        // Count comments

        const count = await Comment.countDocuments({

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
// Reply to a Comment
// =========================

exports.replyToComment = async (req, res) => {

    try {

        // Validate Comment ID

        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid comment ID."

            });

        }

        // Find parent comment

        const parentComment = await Comment.findById(req.params.commentId);

        if (!parentComment) {

            return res.status(404).json({

                success: false,
                message: "Comment not found."

            });

        }

        // Validate reply text

        if (!req.body.text || req.body.text.trim() === "") {

            return res.status(400).json({

                success: false,
                message: "Reply text is required."

            });

        }

        // Create reply

        const reply = await Comment.create({

            author: req.user._id,

            post: parentComment.post,

            text: req.body.text.trim(),

            parentComment: parentComment._id,

            isReply: true

        });

        await reply.populate(

            "author",

            "firstName lastName username profilePicture"

        );

        res.status(201).json({

            success: true,

            message: "Reply added successfully.",

            reply

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
// Get Replies
// =========================

exports.getReplies = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {

            return res.status(400).json({

                success: false,
                message: "Invalid comment ID."

            });

        }

        const parentComment = await Comment.findById(req.params.commentId);

        if (!parentComment) {

            return res.status(404).json({

                success: false,
                message: "Comment not found."

            });

        }

        const replies = await Comment.find({

            parentComment: req.params.commentId,

            isReply: true

        })

        .populate(

            "author",

            "firstName lastName username profilePicture"

        )

        .sort({

            createdAt: 1

        });

        res.json({

            success: true,

            count: replies.length,

            replies

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