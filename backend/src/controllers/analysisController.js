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
    try{

        const { resumeText, jobDescription,  jobTitle, userID} = req.body;
        // Extract skills from resume and job description
        const applicantSkills = extractSkills(resumeText);
        const postingSkills = extractSkills(jobDescription);

        //Find how many skills are missing
        const missingSkills = postingSkills.filter(skill => !applicantSkills.includes(skill));

        //Calculate analysis score
        const score = Math.round((requiredSkills.length - missingSkills.length) / requiredSkills.length * 100);

        //create the analysis model
        const analysis = await Analysis.create({
            userID,
            jobTitle,
            jobDescription,
            resumeText,
            aaplicantSkills,
            postingSkills,
            analysisScore: score,
        })
        res.status(201).json({
            sucess: true,
            data: analysis
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};