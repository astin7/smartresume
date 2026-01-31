const express = require("express");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "running" });
  console.log("Health check hit")
});

module.exports = app;