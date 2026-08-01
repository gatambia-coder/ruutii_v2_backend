const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");

// Authentication
router.post("/register", authController.register);
router.post("/login", authController.login);

// User Profile
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

// Upload Profile Picture
router.put(
    "/profile-picture",
    authMiddleware,
    upload.single("profilePicture"),
    userController.uploadProfilePicture
);

module.exports = router;