const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getJobList } = require("../controllers/joblist.controller");

router.get("/", authMiddleware, getJobList);

module.exports = router;