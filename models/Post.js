const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(

    {

        author: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },

        text: {

            type: String,

            trim: true,

            default: ""

        },

        images: {

            type: [String],

            default: []

        },

        videos: {

            type: [String],

            default: []

        },

        pdfs: {

            type: [String],

            default: []

        },

        visibility: {

            type: String,

            enum: ["public", "friends", "private"],

            default: "public"

        }

    },

    {

        timestamps: true

    }

);

module.exports = mongoose.model("Post", postSchema);