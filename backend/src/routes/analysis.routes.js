const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/auth.middleware");
const fileHandler = require("../middleware/upload.middleware"); 

// --- CRITICAL IMPORTS ---
// 1. Using the fork that works with modern Node (v25)
const pdf = require("pdf-parse-fork");
// 2. Importing the function from your controller
const { runAnalysis } = require("../controllers/analysis.controller");

// 1. Get all past analyses for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("FETCH HISTORY ERROR:", error);
        res.status(500).json({ error: "Server error fetching history" });
    }
});

// 2. The Upload + Analysis Route
router.post("/", authMiddleware, fileHandler.single("resume"), async (req, res) => {
    try {
        const { jobDescription, jobTitle } = req.body;

        // Validation
        if (!req.file) return res.status(400).json({ error: "Please upload a PDF resume." });
        if (!jobDescription) return res.status(400).json({ error: "Missing job description." });

        // Convert PDF Buffer to Text using the fork
        const pdfData = await pdf(req.file.buffer);
        const resumeText = pdfData.text;

        // Run the Gemini AI Analysis via the Controller
        // We pass the parsed text, JD, Title, and UserID
        const result = await runAnalysis(
            resumeText, 
            jobDescription, 
            jobTitle, 
            req.user._id
        );

        // Return the saved analysis object
        res.status(201).json(result);

    } catch (error) {
        console.error("ANALYSIS ROUTE ERROR:", error);
        res.status(500).json({ error: "AI Analysis or PDF parsing failed." });
    }
});

module.exports = router;