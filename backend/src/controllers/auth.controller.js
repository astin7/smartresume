// backend/src/controllers/auth.controller.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    console.log("REGISTER CONTROLLER HIT");
    try {
        const { email, password, username } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create the user
        const user = await User.create({ email, password, username });

        // Generate token immediately so they are logged in after signup
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({ 
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.username, // Using username as the display name
                email: user.email
            }
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // CRITICAL: Send the user object so the Dashboard can show the name
        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.username, // Sending the username back to the frontend
                email: user.email
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser
};