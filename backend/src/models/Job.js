const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyName: {
        type: String,
        required: true,
    },
    roleTitle: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Bookmarked", "Applied", "Interviewing", "Offer", "Rejected"],
        default: "Bookmarked"
    },
    jobUrl: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Job", JobSchema);