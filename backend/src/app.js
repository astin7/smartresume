const express = require("express");

const app = express();
const analysisRoutes = require("../routes/analysis.routes");


app.use(express.json());

app.use("/analysis", analysisRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "running" });
  console.log("Health check hit")
});

module.exports = app;