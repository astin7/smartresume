const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    // Links this resume to a specific user
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    // The original name of the file (e.g., "Astin_SWE_Resume.pdf")
    fileName: { 
        type: String, 
        required: true 
    },
    // Where the file is actually stored
    fileUrl: { 
        type: String, 
        required: true 
    },
    // Is this the default resume to use for quick scans?
    isPrimary: { 
        type: Boolean, 
        default: false 
    },
    // Tracks how many times they've analyzed this specific resume
    scanCount: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

module.exports = mongoose.model("Resume", resumeSchema);