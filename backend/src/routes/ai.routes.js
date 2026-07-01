const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/auth.middleware");
const Resume = require("../models/Resume"); // Bring in the Resume model

router.post("/match", authMiddleware, async (req, res) => {
    try {
        // Diagnostic log to confirm the route is being hit
        console.log("Received AI Match request for:", req.body.jobTitle);

        const { jobTitle, company, location } = req.body;
        const userId = req.user.id || req.user._id;

        // Fetch the user's primary resume from MongoDB
        const primaryResume = await Resume.findOne({ user: userId, isPrimary: true });
        
        let candidateText = "The candidate has not uploaded a primary resume yet.";
        
        // Use the extracted text if it exists
        if (primaryResume && primaryResume.extractedText) {
            candidateText = primaryResume.extractedText;
        }

        // Setup Gemini AI
        const apiKey = process.env.AI_API_KEY;
        if (!apiKey) {
            console.error("API Key is missing from .env!");
            return res.status(500).json({ error: "API key is missing from backend configuration." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the stable 2.0 model to avoid 503 errors
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Send the real resume and the job details to the AI
        const prompt = `
        You are an expert technical recruiter. Analyze the fit between the provided candidate resume and the target job.
        
        Target Job: ${jobTitle} at ${company} (${location})
        
        Candidate Resume:
        ${candidateText}
        
        Provide your response strictly in the following JSON format without any markdown blocks or additional text:
        {
          "score": <number between 0 and 100>,
          "feedback": [
            "<bullet point 1 identifying a strength or match>",
            "<bullet point 2 identifying a gap or area to tailor>",
            "<bullet point 3 giving an actionable recommendation>"
          ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Strip out markdown formatting if the AI includes it
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const parsedResult = JSON.parse(text);
        
        res.status(200).json(parsedResult);
    } catch (error) {
        console.error("AI Match Error:", error);
        // Pass the 429 status down to the frontend
        if (error.status === 429 || (error.message && error.message.includes("429"))) {
            return res.status(429).json({ error: "Too many requests" });
        }
        res.status(500).json({ error: "Failed to generate AI match score" });
    }
});

// Generate AI Cover Letter
router.post("/cover-letter", authMiddleware, async (req, res) => {
    try {
        console.log("📥 Received AI Cover Letter request for:", req.body.jobTitle);

        const { jobTitle, company, location } = req.body;
        const userId = req.user.id || req.user._id;

        // Fetch the primary resume
        const primaryResume = await Resume.findOne({ user: userId, isPrimary: true });
        
        let candidateText = "The candidate has not uploaded a primary resume yet.";
        if (primaryResume && primaryResume.extractedText) {
            candidateText = primaryResume.extractedText;
        }

        // Setup Gemini AI
        const apiKey = process.env.AI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API key is missing from backend." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the stable 2.0 model to avoid 503 errors
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Prompt for the Cover Letter
        const prompt = `
        You are an expert career coach and executive copywriter. Write a compelling, highly tailored cover letter for the following job based on the candidate's resume.
        
        Target Job: ${jobTitle} at ${company} (${location})
        
        Candidate Resume:
        ${candidateText}
        
        Requirements:
        - Write in a modern, confident, and professional tone.
        - Highlight specific achievements from the resume that directly align with the target job.
        - Do not use generic placeholders like [Company Name] if the information is provided.
        - Return ONLY the text of the cover letter. Do not use markdown blocks, JSON, or introductory conversational filler.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        res.status(200).json({ coverLetter: text });
    } catch (error) {
        console.error("AI Cover Letter Error:", error);
        // Pass the 429 status down to the frontend
        if (error.status === 429 || (error.message && error.message.includes("429"))) {
            return res.status(429).json({ error: "Too many requests" });
        }
        res.status(500).json({ error: "Failed to generate cover letter" });
    }
});

module.exports = router;