const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        resumeUrl: { 
            type: String, 
            default: "" 
        },
        settings: {
            targetRole: { type: String, default: "Software Engineer" },
            theme: { type: String, default: "dark" }
        },
        resumeText: { type: String, default: "" },
        scans: { type: Number, default: 0 },

    },
    { 
        timestamps: true 
    }
);

// Hash password before saving (Fixed: removed 'next')
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);