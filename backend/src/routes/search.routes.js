const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

// ==========================================
// GET: Fetch live jobs from external API
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        // Default to software engineering if no query is provided
        const searchTerm = req.query.q || "software engineer intern";
        
        // Using Remotive's free public API for tech roles
        const url = `https://remotive.com/api/remote-jobs?category=software-dev&search=${encodeURIComponent(searchTerm)}`;

        // Node.js v18+ has native fetch built-in
        const response = await fetch(url);
        const data = await response.json();

        if (!data.jobs) {
            return res.status(200).json([]);
        }

        // Clean up and format the API response to fit our platform
        const formattedJobs = data.jobs.slice(0, 15).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company_name,
            location: job.candidate_required_location,
            type: job.job_type,
            url: job.url,
            // Convert their timestamp into a readable date
            postedAt: new Date(job.publication_date).toLocaleDateString()
        }));

        res.status(200).json(formattedJobs);
    } catch (error) {
        console.error("Job Search API Error:", error);
        res.status(500).json({ error: "Failed to fetch live jobs from external API" });
    }
});

module.exports = router;