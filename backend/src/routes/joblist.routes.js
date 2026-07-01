const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const authMiddleware = require("../middleware/auth.middleware");

// READ: Get all jobs for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user._id }).sort({ createdAt: -1 });
        // Sending the array directly so React can map over it!
        res.status(200).json(jobs);
    } catch (error) {
        console.error("Fetch Jobs Error:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// CREATE: Add a new job
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { companyName, roleTitle, status, jobUrl, location, notes } = req.body;
        
        if (!companyName || !roleTitle) {
            return res.status(400).json({ error: "Company name and role title are required." });
        }

        const newJob = new Job({
            user: req.user._id,
            companyName,
            roleTitle,
            status: status || "Bookmarked",
            jobUrl,
            location,
            notes
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error("Create Job Error:", error);
        res.status(500).json({ error: "Failed to save job" });
    }
});

// DELETE: Remove a job from the tracker
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedJob = await Job.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!deletedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({ error: "Failed to delete job" });
    }
});

// UPDATE: Change job status or notes
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { $set: req.body },
            { new: true } // Returns the updated document
        );

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        console.error("Update Job Error:", error);
        res.status(500).json({ error: "Failed to update job" });
    }
});

module.exports = router;