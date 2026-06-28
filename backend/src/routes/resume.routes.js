const express = require("express");
const multer = require("multer");
const PDFParser = require("pdf2json");
const User = require("../models/User");

// 1. FIXED: Import the default export from your middleware file
const authMiddleware = require("../middleware/auth.middleware"); 

const router = express.Router();

const storage = multer.memoryStorage();
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

// 2. FIXED: Use authMiddleware here to protect the route
router.post("/upload", authMiddleware, upload.single("resumePdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    console.log("File received from user:", req.user.name);

    const pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF Parsing Error:", errData.parserError);
      return res.status(500).json({ message: "Error extracting text from PDF" });
    });

    // Make this callback async so we can talk to MongoDB
    pdfParser.on("pdfParser_dataReady", async () => {
      const extractedText = pdfParser.getRawTextContent();
      
      try {
        // Save the text to the logged-in user and increment their scan count!
        await User.findByIdAndUpdate(req.user._id, {
            resumeText: extractedText,
            $inc: { scans: 1 }
        });

        console.log("Successfully saved resume to database for:", req.user.email);

        return res.status(200).json({ 
          message: "Resume successfully parsed and saved to profile!",
          fileName: req.file.originalname
        });

      } catch (dbError) {
        console.error("Database Error:", dbError);
        return res.status(500).json({ message: "Parsed, but failed to save to database." });
      }
    });

    pdfParser.parseBuffer(req.file.buffer);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during file upload." });
  }
});

module.exports = router;