const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/auth.middleware");
const fileHandler = require("../middleware/upload.middleware"); 

// Using the fork that works with modern Node (v25)
const pdf = require("pdf-parse-fork");
// Importing the function from the analysis controller
const { createAnalysis } = require("../controllers/analysis.controller");

// Get all past analyses for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("FETCH HISTORY ERROR:", error);
        res.status(500).json({ error: "Server error fetching history" });
    }
});

// The Upload + Analysis Route
router.post("/", authMiddleware, fileHandler.single("resume"), async (req, res) => {
    try {
        const { jobDescription, jobTitle } = req.body;

        if (!req.file) return res.status(400).json({ error: "Please upload a PDF resume." });
        if (!jobDescription) return res.status(400).json({ error: "Missing job description." });

        const pdfData = await pdf(req.file.buffer);
        req.body.resumeText = pdfData.text;

        // Call the exported controller function
        return createAnalysis(req, res);

    } catch (error) {
        console.error("ANALYSIS ROUTE ERROR:", error);
        res.status(500).json({ error: "AI Analysis or PDF parsing failed." });
    }
});

module.exports = router;