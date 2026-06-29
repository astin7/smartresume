const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const SavedJob = require("../models/SavedJob");

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { id, title, company, location, type, url, postedAt } = req.body;
        
        // Ensure this matches how your authMiddleware assigns the user ID
        const userId = req.user.id || req.user._id; 

        // Check if the user already saved this specific job to prevent duplicates
        const existingJob = await SavedJob.findOne({ userId, jobId: id });
        if (existingJob) {
            return res.status(400).json({ message: "Job is already saved" });
        }

        const newSavedJob = new SavedJob({
            userId,
            jobId: id,
            title,
            company,
            location,
            type,
            url,
            postedAt
        });

        await newSavedJob.save();
        res.status(201).json({ message: "Job saved successfully", job: newSavedJob });

    } catch (error) {
        console.error("Save Job Error:", error);
        res.status(500).json({ error: "Failed to save job" });
    }
});

module.exports = router;