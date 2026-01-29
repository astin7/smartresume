const AnalysisSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobTitle:{
        type: String,
        required: true,
    },
    jobDescription:{
        type: String,
        required: true,
    },
    resumeText:{
        type: String,
        required: true,
    },
    applicantSkills:{
        type: [String],
        default: null
    },
    postingSkills:{
        type:[String],
        default: null,
    },
    analysisScore:{
        type: Number,
        default: null,
    }
});
module.export = mongoose.model("Analysis", AnalysisSchema);

