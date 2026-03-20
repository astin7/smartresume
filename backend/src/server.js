const express = require("express")
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5050;
const mongo_url = process.env.MONGO_URI;
mongoose.connect(mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Server is running")
   });
  })
.catch((error) =>{
  console.error("MongoDB connection error:", error);
});
