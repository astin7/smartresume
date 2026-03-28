// backend/src/services/ai.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.runAIAnalysis = async (resumeText, jobDescription) => {
    // Initializing inside the function ensures process.env is ready
    const gen = new GoogleGenerativeAI(process.env.AI_API_KEY);
    const model = gen.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const prompt = `
    You are a resume analysis expert. 
    Please compare this applicant's resume info against the job description 
    and return ONLY a valid JSON object in this format:
    {
        "applicantSkills": ["skill1", "skill2"],
        "postingSkills": ["skill1", "skill2"],
        "analysisScore": 85
    }
    
    Resume: ${resumeText}
    Job Description: ${jobDescription}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON using regex in case Gemini wraps it in markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return valid JSON");
        }
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini AI Service Error:", error.message);
        throw error; // Let the controller handle the catch
    }
};