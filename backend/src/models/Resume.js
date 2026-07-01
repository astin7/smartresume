const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    fileName: { 
        type: String, 
        required: true 
    },
    fileUrl: { 
        type: String, 
        required: true 
    },
    // NEW: Store the actual text of the resume so the AI can read it instantly
    extractedText: {
        type: String,
        default: ""
    },
    isPrimary: { 
        type: Boolean, 
        default: false 
    },
    scanCount: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);