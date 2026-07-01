const express = require("express");
const cors = require("cors");
const analysisRoutes = require("./routes/analysis.routes");
const joblistRoutes = require("./routes/joblist.routes"); 
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require('./routes/resume.routes');
const searchRoutes = require("./routes/search.routes");
const savedJobsRoutes = require("./routes/savedJobs.routes"); 

const app = express();

app.use(cors({
    origin: true, 
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/analysis", analysisRoutes);
app.use("/api/joblist", joblistRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/resume', resumeRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/saved-jobs", savedJobsRoutes); 
app.use("/api/ai", require("./routes/ai.routes"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "running" });
});

module.exports = app;