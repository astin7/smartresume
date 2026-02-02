async function fetchJobList(filters) {
  const { keyword, location, internship, remote } = filters;

  // Temporary mock data, so we're going to replace this later
  const jobs = [
    {
      title: "Software Engineering Intern",
      company: "Tech Corp",
      location: "Remote",
      internship: true,
      remote: true,
      url: "https://example.com/job/1"
    },
    {
      title: "Junior Backend Developer",
      company: "Startup Inc",
      location: "New York",
      internship: false,
      remote: false,
      url: "https://example.com/job/2"
    }
  ];

  // Apply filters
  return jobs.filter(job => {
    if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase())) {
      return false;
    }

    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }

    if (internship === "true" && !job.internship) {
      return false;
    }

    if (remote === "true" && !job.remote) {
      return false;
    }

    return true;
  });
}

module.exports = { fetchJobList };
