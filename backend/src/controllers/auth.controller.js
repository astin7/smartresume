// backend/src/controllers/auth.controller.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    console.log("REGISTER CONTROLLER HIT");
    try {
        // CHANGED 'username' to 'name'
        const { email, password, name } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // CHANGED 'username' to 'name'
        const user = await User.create({ email, password, name });

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
                name: user.name, // CHANGED to user.name
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
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.name, // CHANGED to user.name
                email: user.email
            }
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

const getUserProfile = async (req, res) => {
    // req.user is securely fetched by the authMiddleware before this runs
    if (req.user) {
        res.json({
            id: req.user._id,
            name: req.user.name, // CHANGED to req.user.name
            email: req.user.email,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile 
};