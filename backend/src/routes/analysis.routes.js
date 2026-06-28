const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const User = require("../models/User"); 
const authMiddleware = require("../middleware/auth.middleware");

const { createAnalysis } = require("../controllers/analysis.controller");

router.get("/", authMiddleware, async (req, res) => {
    try {
        const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("FETCH HISTORY ERROR:", error);
        res.status(500).json({ error: "Server error fetching history" });
    }
});

// --- THE NEW ROUTE ---
router.post("/compare", authMiddleware, async (req, res) => {
    // 1. A LOUD CONSOLE LOG TO PROVE WE MADE IT HERE
    console.log("\n========================================");
    console.log("🚀 /api/analysis/compare ROUTE HIT!");
    console.log("========================================\n");

    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ error: "Missing job description." });
        }

        const user = await User.findById(req.user._id);
        
        if (!user || !user.resumeText) {
            console.log("❌ No resume text found in database for user!");
            return res.status(400).json({ error: "No resume found. Please upload a resume first." });
        }

        console.log("✅ Successfully retrieved saved resume text from database.");

        // Attach the saved resume text to the request body for the controller
        req.body.resumeText = user.resumeText;

        // Hand off to your existing AI controller
        console.log("🤖 Handing data off to AI Controller...");
        return createAnalysis(req, res);

    } catch (error) {
        console.error("ANALYSIS ROUTE ERROR:", error);
        res.status(500).json({ error: "Analysis configuration failed." });
    }
});

module.exports = router;