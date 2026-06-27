const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure Multer to hold the file in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF format is allowed!"));
    }
  }
});

// The actual route to catch the file
router.post('/upload', upload.single('resumePdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Success! Multer caught the file. 
    console.log("File received:", req.file.originalname);
    console.log("File size:", req.file.size, "bytes");

    // Later, we will pass req.file.buffer to our AI parser here!
    
    res.status(200).json({ 
      message: "Resume successfully received by the server!",
      fileName: req.file.originalname 
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error processing file" });
  }
});

module.exports = router;