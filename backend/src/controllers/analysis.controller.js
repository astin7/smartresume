// backend/src/controllers/analysis.controller.js
const Analysis = require("../models/Analysis");
const { runAIAnalysis } = require("../services/ai.service");

// Manual fallback skill extraction logic
function extractSkills(textInput){
    const skillSet = [
        "Javascript", "Microsoft Excel", "Microsoft Office", "QuickBooks", "Python",
        "SQL", "Tableau", "R", "Java", "C++", "HTML", "CSS", "React", "Node.js",
        "Django", "Flask", "AWS", "Azure", "Google Cloud", "Machine Learning",
        "Data Analysis", "Project Management", "Agile Methodologies", "Scrum",
        "Communication", "Leadership", "Problem Solving", "Time Management"
    ];
    const toLowerCase = textInput.toLowerCase();
    return skillSet.filter(skill => toLowerCase.includes(skill.toLowerCase()));
}

exports.createAnalysis = async (req, res) => {
    console.log("Create Analysis Hit - Starting AI Processing...");
    try {
        const { resumeText, jobDescription, jobTitle } = req.body;
        const userId = req.user?._id;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ success: false, error: "Missing data" });
        }

        if (!userId) {
            return res.status(401).json({ success: false, error: "Not authenticated" });
        }

        // Call the AI Service
        let aiResults;
        try {
            aiResults = await runAIAnalysis(resumeText, jobDescription);
        } catch (aiError) {
            console.error("AI Analysis failed, falling back to manual extraction:", aiError.message);
            const manualApplicant = extractSkills(resumeText);
            const manualPosting = extractSkills(jobDescription);
            
            // Manual fallback calculation
            const manualMissing = manualPosting.filter(postSkill => 
                !manualApplicant.some(appSkill => appSkill.toLowerCase() === postSkill.toLowerCase())
            );

            aiResults = {
                applicantSkills: manualApplicant,
                postingSkills: manualPosting,
                analysisScore: manualPosting.length === 0 ? 0 : 
                    Math.round(((manualPosting.length - manualMissing.length) / manualPosting.length) * 100)
            };
        }

        // Create the record in MongoDB
        const analysis = await Analysis.create({
            user: userId,
            jobTitle,
            jobDescription,
            resumeText,
            applicantSkills: aiResults.applicantSkills,
            postingSkills: aiResults.postingSkills,
            analysisScore: aiResults.analysisScore,
        });

        // 3. Case-insensitive missing skills calculation
        // makes sure "Python" matches "python" so the red box populates correctly
        const missingSkills = aiResults.postingSkills.filter(postSkill => 
            !aiResults.applicantSkills.some(appSkill => 
                appSkill.toLowerCase() === postSkill.toLowerCase()
            )
        );

        res.status(201).json({
            success: true,
            analysis: {
                ...analysis.toObject(),
                missingSkills: missingSkills
            }
        });
    } catch (error) {
        console.error("Full Analysis Controller Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};