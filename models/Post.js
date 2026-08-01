const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(

    {

        type: {

            type: String,

            enum: ["image", "video", "pdf", "audio"],

            required: true

        },

        url: {

            type: String,

            required: true

        },

        originalName: {

            type: String,

            default: ""

        },

        mimeType: {

            type: String,

            default: ""

        },

        size: {

            type: Number,

            default: 0

        },

        thumbnail: {

            type: String,

            default: ""

        },

        duration: {

            type: Number,

            default: 0

        },

        pages: {

            type: Number,

            default: 0

        }

    },

    { _id: false }

);

const postSchema = new mongoose.Schema(

    {

        author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        caption: {

            type: String,

            trim: true,

            maxlength: 5000,

            default: ""

        },

        attachments: [attachmentSchema],

        visibility: {

            type: String,

            enum: ["public", "friends", "private"],

            default: "public"

        },

        location: {

            type: String,

            default: ""

        },

        tags: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User"

            }

        ],

        likes: {

            type: Number,

            default: 0

        },

        comments: {

            type: Number,

            default: 0

        },

        shares: {

            type: Number,

            default: 0

        },

        bookmarks: {

            type: Number,

            default: 0

        },

        edited: {

            type: Boolean,

            default: false

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model("Post", postSchema);