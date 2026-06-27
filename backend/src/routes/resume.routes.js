const express = require("express");
const multer = require("multer");
const PDFParser = require("pdf2json"); // The modern replacement!
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

router.post("/upload", upload.single("resumePdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    console.log("File received:", req.file.originalname);

    // --- THE NEW EXTRACTION ENGINE ---
    // The '1' flag tells the parser we only care about the raw text
    const pdfParser = new PDFParser(this, 1);

    // 1. What happens if the parser fails
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF Parsing Error:", errData.parserError);
      return res.status(500).json({ message: "Error extracting text from PDF" });
    });

    // 2. What happens when the parser successfully reads the file
    pdfParser.on("pdfParser_dataReady", () => {
      // Grab the raw text!
      const extractedText = pdfParser.getRawTextContent();
      
      console.log("--- EXTRACTED TEXT PREVIEW ---");
      console.log(extractedText.substring(0, 200) + "...\n------------------------------");

      // Send the text back to the frontend
      return res.status(200).json({ 
        message: "Resume successfully parsed!",
        fileName: req.file.originalname,
        textPreview: extractedText.substring(0, 500) 
      });
    });

    // 3. Feed the memory buffer into the parser to start the process
    pdfParser.parseBuffer(req.file.buffer);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during file upload." });
  }
});

module.exports = router;