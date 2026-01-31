const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { resumeText, jobDescription, jobTitle } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const analysis = await Analysis.create({
            user: req.user._id,
            resumeText,
            jobDescription,
            jobTitle: jobTitle || "",
            postingSkills: [],
            applicantSkills: [],
        });

        res.status(201).json(analysis);
    } catch (error) {
        console.error("ANALYSIS ERROR:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;