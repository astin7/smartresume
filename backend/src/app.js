const express = require("express");
const analysisRoutes = require("./routes/analysis.routes");
const joblistRoutes = require("./routes/joblist.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());

app.use("/api/analysis", analysisRoutes);
app.use("/api/joblist", joblistRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "running" });
  console.log("Health check hit")
});

module.exports = app;
