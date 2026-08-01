const multer = require("multer");
const path = require("path");

// Storage configuration

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, "uploads/profile-pictures");

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName +
            path.extname(file.originalname)
        );

    }

});

// File filter

const fileFilter = (req, file, cb) => {

    const allowed = [

        "image/jpeg",
        "image/png",
        "image/webp"

    ];

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only JPG, PNG and WEBP images are allowed."));

    }

};

// Upload middleware

const upload = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter

});

module.exports = upload;