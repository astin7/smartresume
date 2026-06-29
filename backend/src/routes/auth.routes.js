const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware"); // Imported directly!

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protect the route with your middleware
router.get("/me", authMiddleware, getUserProfile); 

module.exports = router;