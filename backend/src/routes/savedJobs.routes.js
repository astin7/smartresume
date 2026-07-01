const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const SavedJob = require("../models/SavedJob");

// POST: Save a new job
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { id, title, company, location, type, url, postedAt } = req.body;
        const userId = req.user.id || req.user._id; 

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

// GET: Retrieve all saved jobs for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        // Fetch jobs and sort them by newest first
        const savedJobs = await SavedJob.find({ userId }).sort({ savedAt: -1 });
        res.status(200).json(savedJobs);
    } catch (error) {
        console.error("Fetch Saved Jobs Error:", error);
        res.status(500).json({ error: "Failed to fetch saved jobs" });
    }
});

// DELETE: Remove a saved job
router.delete("/:jobId", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { jobId } = req.params;
        
        await SavedJob.findOneAndDelete({ userId, jobId });
        res.status(200).json({ message: "Job removed successfully" });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ error: "Failed to delete job" });
    }
});

// ==========================================
// PATCH: Update Job Status (Kanban Board)
// ==========================================
router.patch("/:jobId/status", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { jobId } = req.params;
        const { status } = req.body;
        
        // Find the job belonging to the user and update its status
        const updatedJob = await SavedJob.findOneAndUpdate(
            { userId, jobId },
            { status: status },
            { new: true } // Returns the updated document
        );

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ error: "Failed to update job status" });
    }
});

module.exports = router;