const multer = require('multer');

// Use MemoryStorage because we don't need to keep the PDF 
// on our hard drive after Gemini reads it
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // this limits to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed!"), false);
    }
  }
});

module.exports = upload;