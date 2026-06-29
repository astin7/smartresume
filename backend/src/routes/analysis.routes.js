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

// --- NEW DELETE ROUTE ---
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deleted = await Analysis.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!deleted) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        res.status(200).json({ message: "Analysis deleted successfully" });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// --- COMPARE ROUTE ---
router.post("/compare", authMiddleware, async (req, res) => {
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

        req.body.resumeText = user.resumeText;

        console.log("🤖 Handing data off to AI Controller...");
        return createAnalysis(req, res);

    } catch (error) {
        console.error("ANALYSIS ROUTE ERROR:", error);
        res.status(500).json({ error: "Analysis configuration failed." });
    }
});

module.exports = router;