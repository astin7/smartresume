const { GoogleGenerativeAI } = require("@google/generative-ai");

const gen = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = gen.getGenerativeModel({model: "gemini-1.5-flash"});

exports.runAIAnalysis = async (jobDescription, resumeText) => {
    const prompt = `
    You are a resume analysis expert. 
    Please compare this applicant's resume info against the job description 
    and return a valid json in this format
    {
        "applicantSkills": [list of skills from the resume],
        "postingSkills": [list of skills from the job description]
        "analysisScore": integer score from 0 to 100 indicating how well the applicant's skills match the job description
    }
    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}
    `;
    const response = await model.generateContent(prompt);
    //set repsonse to text
    const text = response.response.text();

    //did Gemini wrap text or return a valid json?
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
    throw new Error("AI did not return JSON");
  }
    return JSON.parse(jsonMatch[0]);

}