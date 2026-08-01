const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const app = express();
const friendRoutes = require("./routes/friendRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(cors());
app.use(express.json());

const path = require("path");
console.log(path.join(__dirname, "uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Ruutii API v2"
    });
});


module.exports = app;