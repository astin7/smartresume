const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Links the job to the specific user who saved it
        required: true 
    },
    jobId: { type: String, required: true }, // Adzuna's unique job ID
    title: { type: String, required: true },
    company: { type: String },
    location: { type: String },
    type: { type: String },
    url: { type: String, required: true },
    postedAt: { type: String },
    savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedJob", savedJobSchema);