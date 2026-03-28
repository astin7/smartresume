require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app"); 

const PORT = process.env.PORT || 5050;
const mongo_url = process.env.MONGO_URI;

mongoose.connect(mongo_url)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
  })
.catch((error) =>{
  console.error("MongoDB connection error:", error);
});