const { runAIAnalysis } = require("./ai.service");
const {runRuleBasedAnalysis} = require("./rule.service");

exports.runAnalysis = async (resumeText, jobDescription) => {
    if (process.env.USE_AI === "true") {
        try {
            return await runAIAnalysis(resumeText, jobDescription);
        } catch (error){
        console.error("Error running AI analysis:", error);
        return runRuleBasedAnalysis(resumeText, jobDescription);
        }
    }

    return runRuleBasedAnalysis(resumeText, jobDescription);
}