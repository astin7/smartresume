const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, async (req, res) => {
    try {
        // Added 'company' to the incoming query parameters
        const { what, where, type, company } = req.query;
        
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        if (!appId || !appKey) {
            console.error("❌ CRITICAL: Adzuna API keys are missing or undefined in .env!");
            return res.status(500).json({ error: "API Keys missing from backend" });
        }

        const params = new URLSearchParams({
            app_id: appId,
            app_key: appKey,
            results_per_page: "20",
            what: what || "" // Fallback to empty string if searching only by company
        });

        const isCountrywide = !where || where.toLowerCase() === "united states" || where.toLowerCase() === "us";
        if (!isCountrywide) {
            params.append("where", where);
        }

        if (type === 'full_time') params.append('full_time', '1');

        // NEW: Append the company parameter if the user typed one
        if (company && company.trim() !== "") {
            params.append('company', company.trim());
        }

        const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?${params.toString()}`;
        
        console.log(`🔍 Searching Adzuna: what="${what || 'any'}", company="${company || 'any'}", where="${isCountrywide ? 'US' : where}"`);

        const response = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`❌ ADZUNA REJECTED REQUEST (Status: ${response.status})`);
            return res.status(response.status).json({ error: "API Request Failed" });
        }

        const data = await response.json();
        
        if (!data.results) {
            return res.status(200).json([]);
        }

        const formattedJobs = data.results.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company?.display_name || "Unknown",
            location: job.location?.display_name || "Remote",
            type: job.contract_type || "N/A",
            url: job.redirect_url,
            postedAt: job.created ? new Date(job.created).toLocaleDateString() : "N/A"
        }));
        
        res.status(200).json(formattedJobs);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;