const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");

router.post("/", async (req, res) =>{
    
    //Finish Try and Catch Statements
    try{
        const { resumeText, jobDescription } = req.body;
            if(!resumeText || !jobDescription){
             return res.status(400);
            }


            // Analysis Logic Section
            const analysisScore = 80; //Is this where the AI integration Goes?



            const analysis = await Analysis.create({
                resumeText,
                jobDescription,
                jobTitle,
                postingSkills: [],
                applicantSkills: [],
            });

            //response
            res.json(analysis)

        }
    catch(error){
        res.status(500)
    }

}
)

module.exports = router;