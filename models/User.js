const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        default: "/images/default-profile.png"
    },

    coverPhoto: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: ""
    },

    verified: {
        type: Boolean,
        default: false
    },

    storageUsed: {
        type: Number,
        default: 0
    },

    storageLimit: {
        type: Number,
        default: 1073741824
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

},

{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);