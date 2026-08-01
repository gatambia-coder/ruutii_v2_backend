const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// =========================
// Format User Response
// =========================

const formatUser = (user) => {

    return {

        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        verified: user.verified,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt

    };

};

// =========================
// Get Profile
// =========================

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        res.json({

            success: true,
            message: "Profile loaded successfully.",
            user: formatUser(user)

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
// Update Profile
// =========================

exports.updateProfile = async (req, res) => {

    try {

        const { firstName, lastName, bio } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully.",
            user: formatUser(user)
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
// Upload Profile Picture
// =========================

exports.uploadProfilePicture = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "Please upload an image."

            });

        }

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        user.profilePicture = "/uploads/profile-pictures/" + req.file.filename;

        await user.save();

        res.json({

            success: true,
            message: "Profile picture uploaded successfully.",

            profilePicture: user.profilePicture

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

exports.uploadCoverPhoto = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "No file uploaded."

            });

        }

        // Delete old cover photo if it exists
        if (user.coverPhoto) {

            const oldPath = path.join(

                __dirname,

                "..",

                user.coverPhoto

            );

            if (fs.existsSync(oldPath)) {

                fs.unlinkSync(oldPath);

            }

        }

        user.coverPhoto =

            "/uploads/cover-photos/" +

            req.file.filename;

        await user.save();

        res.json({

            success: true,

            message: "Cover photo uploaded successfully.",

            coverPhoto: user.coverPhoto

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