const express = require("express");
const multer = require("multer");
const PDFParser = require("pdf2json");
const fs = require("fs");
const path = require("path");

const Resume = require("../models/Resume");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// ==========================================
// THE FIX: Ensure the uploads folder exists!
// ==========================================
if (!fs.existsSync("uploads/")) {
    fs.mkdirSync("uploads/", { recursive: true });
}

// Configure local disk storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Save with unique timestamp prefix to avoid name collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF format is allowed!"));
    }
  }
});

// ==========================================
// 1. POST: Upload, Parse, and Save a Resume
// ==========================================
router.post("/upload", authMiddleware, upload.single("resumePdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    console.log(`Processing file upload for user: ${req.user.name}`);

    const pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF Parsing Error:", errData.parserError);
      // Delete the file if parsing fails so we don't clog storage
      if (req.file.path) fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "Error extracting text from PDF" });
    });

    pdfParser.on("pdfParser_dataReady", async () => {
      const extractedText = pdfParser.getRawTextContent();
      
      try {
        // Double-check if the user already has a primary resume
        const hasPrimary = await Resume.findOne({ user: req.user._id, isPrimary: true });

        // Create the new entry in the Resume collection
        const newResume = new Resume({
          user: req.user._id,
          fileName: req.file.originalname,
          fileUrl: req.file.path, // Path to local storage folder
          isPrimary: !hasPrimary // If they have no resumes yet, make this one default automatically
        });

        const savedResume = await newResume.save();

        // Optional: Keep your original User model in sync with the latest text & increment scans
        await User.findByIdAndUpdate(req.user._id, {
            resumeText: extractedText,
            $inc: { scans: 1 }
        });

        console.log(`Saved resume ${req.file.originalname} to vault for ${req.user.email}`);

        return res.status(200).json({ 
          message: "Resume successfully parsed and added to vault!",
          resume: savedResume
        });

      } catch (dbError) {
        console.error("Database Error:", dbError);
        if (req.file.path) fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: "Parsed, but failed to save to database vault." });
      }
    });

    // Read the file from disk to parse it
    pdfParser.parseBuffer(fs.readFileSync(req.file.path));

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during file upload." });
  }
});

// ==========================================
// 2. GET ALL: Fetch all resumes for vault view
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(resumes);
    } catch (error) {
        console.error("Fetch Resumes Error:", error);
        res.status(500).json({ error: "Failed to fetch resumes" });
    }
});

// ==========================================
// 3. PATCH: Switch the default "Primary" resume
// ==========================================
router.patch("/:id/primary", authMiddleware, async (req, res) => {
    try {
        // Set all of this user's resumes to false
        await Resume.updateMany({ user: req.user._id }, { isPrimary: false });

        // Toggle the selected one to true
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isPrimary: true },
            { new: true }
        );

        res.status(200).json(updatedResume);
    } catch (error) {
        console.error("Set Primary Error:", error);
        res.status(500).json({ error: "Failed to set primary resume" });
    }
});

// ==========================================
// 4. DELETE: Remove a resume and its local file
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const resumeToDelete = await Resume.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!resumeToDelete) {
            return res.status(404).json({ error: "Resume not found" });
        }

        // Physically delete the local PDF file from the server uploads folder
        if (fs.existsSync(resumeToDelete.fileUrl)) {
            fs.unlinkSync(resumeToDelete.fileUrl);
        }

        // Delete the database entry
        await Resume.findByIdAndDelete(resumeToDelete._id);
        
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        console.error("Delete Resume Error:", error);
        res.status(500).json({ error: "Failed to delete resume" });
    }
});

module.exports = router;