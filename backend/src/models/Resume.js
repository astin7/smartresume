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