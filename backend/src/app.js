const express = require("express");
const cors = require("cors");
const analysisRoutes = require("./routes/analysis.routes");
const joblistRoutes = require("./routes/joblist.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors({
    origin: "*", // Allows any origin to hit the server during testing (must change after done testing)
    credentials: true
}));

app.use(express.json());

// Manual Header Override (should prolly change)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// Routes
app.use("/api/analysis", analysisRoutes);
app.use("/api/joblist", joblistRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "running" });
});

module.exports = app;