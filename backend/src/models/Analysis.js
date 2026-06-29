const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    resumeText: {
        type: String,
        required: true,
    },
    applicantSkills: {
        type: [String],
        default: null
    },
    postingSkills: {
        type: [String],
        default: null,
    },
    analysisScore: {
        type: Number,
        default: null,
    },
    formatting: {
        type: Number,
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model("Analysis", AnalysisSchema);