const express = require("express");
const router = express.Router();
const fs = require("fs");
const PDFParser = require("pdf2json");

const Analysis = require("../models/Analysis");
const User = require("../models/User");
const Resume = require("../models/Resume"); // Added Resume model
const authMiddleware = require("../middleware/auth.middleware");
const { createAnalysis } = require("../controllers/analysis.controller");

// ==========================================
// HELPER: Extract text from PDF on the fly
// ==========================================
const parsePdfText = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));

        if (fs.existsSync(filePath)) {
            pdfParser.parseBuffer(fs.readFileSync(filePath));
        } else {
            reject(new Error("File not found on server storage."));
        }
    });
};

// ==========================================
// 1. GET ALL ANALYSIS HISTORY
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const history = await Analysis.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error("FETCH HISTORY ERROR:", error);
        res.status(500).json({ error: "Server error fetching history" });
    }
});

// ==========================================
// 2. DELETE ANALYSIS
// ==========================================
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

// ==========================================
// 3. COMPARE ROUTE (AI ENGINE)
// ==========================================
router.post("/compare", authMiddleware, async (req, res) => {
    console.log("\n========================================");
    console.log("🚀 /api/analysis/compare ROUTE HIT!");
    console.log("========================================\n");

    try {
        const { jobDescription, resumeId } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ error: "Missing job description." });
        }

        let finalResumeText = "";

        if (resumeId) {
            // SCENARIO A: User picked a specific resume from their vault
            console.log(`🔍 Looking up resume ID: ${resumeId}`);
            const selectedResume = await Resume.findOne({ _id: resumeId, user: req.user._id });

            if (!selectedResume) {
                return res.status(404).json({ error: "Selected resume not found in vault." });
            }

            console.log(`📄 Parsing text from saved vault file: ${selectedResume.fileUrl}`);
            finalResumeText = await parsePdfText(selectedResume.fileUrl);

        } else {
            // SCENARIO B: Fallback (Just uploaded a brand new file)
            const user = await User.findById(req.user._id);
            if (!user || !user.resumeText) {
                console.log("❌ No resume text found in database!");
                return res.status(400).json({ error: "No resume found. Please upload a resume first." });
            }
            console.log("✅ Retrieved recent upload text from User model.");
            finalResumeText = user.resumeText;
        }

        // Attach the extracted text back to the request body
        req.body.resumeText = finalResumeText;

        console.log("🤖 Handing text off to AI Controller...");
        
        // Pass the request forward to your completely untouched controller!
        return createAnalysis(req, res);

    } catch (error) {
        console.error("ANALYSIS ROUTE ERROR:", error);
        res.status(500).json({ error: "Analysis configuration failed." });
    }
});

module.exports = router;