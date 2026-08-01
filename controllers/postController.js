const Post = require("../models/Post");

// =========================
// Create Post
// =========================

exports.createPost = async (req, res) => {

    try {

        const { caption, visibility, location } = req.body;

        const attachments = [];

        if (req.files && req.files.length > 0) {

            req.files.forEach(file => {

                let type = "";

                if (file.mimetype.startsWith("image/")) {

                    type = "image";

                }

                else if (file.mimetype.startsWith("video/")) {

                    type = "video";

                }

                else if (file.mimetype === "application/pdf") {

                    type = "pdf";

                }

                else if (file.mimetype.startsWith("audio/")) {

                    type = "audio";

                }

                attachments.push({

                    type,

                    url: `/uploads/posts/${file.filename}`,

                    originalName: file.originalname,

                    mimeType: file.mimetype,

                    size: file.size

                });

            });

        }

        const post = await Post.create({

            author: req.user._id,

            caption,

            attachments,

            visibility,

            location

        });

        const populatedPost = await Post.findById(post._id)

            .populate(

                "author",

                "firstName lastName username profilePicture"

            );

        res.status(201).json({

            success: true,

            message: "Post created successfully.",

            post: populatedPost

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
// Get Home Feed
// =========================

exports.getPosts = async (req, res) => {

    try {

        const posts = await Post.find()

            .populate(
                "author",
                "firstName lastName username profilePicture"
            )

            .sort({ createdAt: -1 });

        res.json({

            success: true,

            count: posts.length,

            posts

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
// Get Single Post
// =========================

exports.getPost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId)

            .populate(
                "author",
                "firstName lastName username profilePicture"
            );

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found."

            });

        }

        res.json({

            success: true,

            post

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
// Update Post
// =========================

exports.updatePost = async (req, res) => {

    try {

        const { postId } = req.params;

        const { caption, visibility, location } = req.body;

        const post = await Post.findById(postId);

        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found."

            });

        }

        if (post.author.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        if (caption !== undefined)
            post.caption = caption;

        if (visibility !== undefined)
            post.visibility = visibility;

        if (location !== undefined)
            post.location = location;

        post.edited = true;

        await post.save();

        const updatedPost = await Post.findById(post._id)

            .populate(

                "author",

                "firstName lastName username profilePicture"

            );

        res.json({

            success: true,

            message: "Post updated successfully.",

            post: updatedPost

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
// Delete Post
// =========================

const fs = require("fs");
const path = require("path");

exports.deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.postId);

        if (!post) {

            return res.status(404).json({

                success: false,

                message: "Post not found."

            });

        }


        if (post.author.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        for (const attachment of post.attachments) {

            const filePath = path.join(

                __dirname,

                "..",

                attachment.url

            );

            if (fs.existsSync(filePath)) {

                fs.unlinkSync(filePath);

            }

        }

        await post.deleteOne();

        res.json({

            success: true,

            message: "Post deleted successfully."

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

exports.deleteAttachment = async (req, res) => {

    try {

        const { postId, attachmentIndex } = req.params;

        const post = await Post.findById(postId);

        if (!post) {

            return res.status(404).json({

                success: false,
                message: "Post not found."

            });

        }

        if (post.author.toString() !== req.user._id.toString()) {

            return res.status(403).json({

                success: false,
                message: "Unauthorized."

            });

        }

        const index = parseInt(attachmentIndex);

        if (

            isNaN(index) ||

            index < 0 ||

            index >= post.attachments.length

        ) {

            return res.status(400).json({

                success: false,
                message: "Invalid attachment index."

            });

        }

        const attachment = post.attachments[index];

        const filePath = path.join(

            __dirname,

            "..",

            attachment.url

        );

        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

        }

        post.attachments.splice(index, 1);

        await post.save();

        res.json({

            success: true,

            message: "Attachment deleted successfully.",

            attachments: post.attachments

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