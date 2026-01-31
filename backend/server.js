const analysisRoute = require("./routes/analysis");
const express = require('express');

const app = express();

app.use(express.json());
app.use("/analysis", analysisRoute);