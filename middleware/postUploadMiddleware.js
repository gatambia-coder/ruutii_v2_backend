const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads/posts folder if it doesn't exist
const uploadPath = path.join(__dirname, "../uploads/posts");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadPath);

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const allowedTypes = [

    "image/jpeg",
    "image/png",
    "image/webp",

    "video/mp4",
    "video/quicktime",

    "application/pdf",

    "audio/mpeg",
    "audio/wav",
    "audio/mp4"

];

const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Unsupported file type."), false);

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 100 * 1024 * 1024 //100MB

    }

});

module.exports = upload;