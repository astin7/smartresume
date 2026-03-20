// Controller Contains the Logic for the analysis logic

const Analysis = require("../models/Analysis");

// function that extracts from the skill list
function extractSkills(textInput){

    // Here is the skill list it will extract from 
    const skillSet = [
        "Javascript", "Microsoft Excel", "Microsoft Office", "QuickBooks", "Python",
        "SQL", "Tableau", "R", "Java", "C++", "HTML", "CSS", "React", "Node.js",
        "Django", "Flask", "AWS", "Azure", "Google Cloud", "Machine Learning",
        "Data Analysis", "Project Management", "Agile Methodologies", "Scrum",
        "Communication", "Leadership", "Problem Solving", "Time Management"
    ];

    const toLowerCase = textInput.toLowerCase();
    // Filters for the extracted skills by comparing input to the skill set
    return skillSet.filter(skill => toLowerCase.includes(skill.toLowerCase()));
}

//When the controller is used, create a new analysis entry

exports.createAnalysis = async (req, res) => {
    console.log("Create Analysis Hit");
    try{
        
        const { resumeText, jobDescription,  jobTitle } = req.body;
        //temporary userID until auth is implemented
        //const userId = req.user?._id || "000000000000000000000000";

        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                error: "need to input Resume Text and Job Description"
            });
        }
            

        // Extract skills from resume and job description
        const applicantSkills = extractSkills(resumeText);
        const postingSkills = extractSkills(jobDescription);

        //Find how many skills are missing
        const missingSkills = postingSkills.filter(skill => !applicantSkills.includes(skill));

        //Calculate analysis score
        const score = 
            postingSkills.length === 0 ? 0 :
            Math.round((postingSkills.length - missingSkills.length) / postingSkills.length * 100);

        //create the analysis model
        const analysis = await Analysis.create({
            user: userId,
            jobTitle,
            jobDescription,
            resumeText,
            applicantSkills,
            postingSkills,
            analysisScore: score,
        });
        res.status(201).json({
            success: true,
            analysis:{
                ...analysis.toObject(),
                missingSkills
            }
        });
    } catch (error) {
        console.error("Create analysis error:",error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};