const { fetchJobList } = require("../services/joblist.service");

exports.getJobList = async (req, res) => {
  try {
    const { keyword, location, internship, remote } = req.query;

    const jobs = await fetchJobList({
      keyword,
      location,
      internship,
      remote
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("Joblist controller error:", error);
    res.status(500).json({ error: "Failed to fetch job list" });
  }
};
