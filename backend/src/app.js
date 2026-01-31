const express = require("express");
const authRoutes = require("./routes/auth.routes");
const analysisRoutes = require("./routes/analysis.routes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);

module.exports = app;
