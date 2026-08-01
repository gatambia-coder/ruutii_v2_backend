const User = require("../models/User");

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

    res.json({
        success: true,
        message: "Profile loaded successfully.",
        user: req.user
    });

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