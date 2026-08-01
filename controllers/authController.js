const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
// Register User
// =========================

exports.register = async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            username,
            email,
            password
        } = req.body;

        // Check required fields

        if (
            !firstName ||
            !lastName ||
            !username ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }

        // Check if email already exists

        const emailExists =
            await User.findOne({ email });

        if (emailExists) {

            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });

        }

        // Check username

        const usernameExists =
            await User.findOne({ username });

        if (usernameExists) {

            return res.status(400).json({
                success: false,
                message: "Username already taken."
            });

        }

        // Encrypt password

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user

        const user =
            await User.create({

                firstName,
                lastName,
                username,
                email,
                password: hashedPassword

            });

        // Generate Token

        const token =
            jwt.sign(

                {
                    id: user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );

        res.status(201).json({
            success: true,
            message: "Registration successful.",
            token,
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
// Login User
// =========================

exports.login = async (req, res) => {

    try {

        const { login, password } = req.body;

        if (!login || !password) {

            return res.status(400).json({

                success: false,
                message: "Please enter your login details."

            });

        }

        // Find using email OR username

        const user = await User.findOne({

            $or: [

                { email: login.toLowerCase() },

                { username: login.toLowerCase() }

            ]

        });

        if (!user) {

            return res.status(401).json({

                success: false,
                message: "Invalid username/email."

            });

        }

        // Compare password

        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,
                message: "Incorrect password."

            });

        }

        // Generate JWT

        const token = jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.json({

            success: true,

            message: "Login successful.",

            token,

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

