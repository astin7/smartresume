import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Mock data for your Internship Feed (We'll replace this with the API later!)
  const mockJobs = [
    { id: 1, company: "Google", role: "SWE Intern", location: "Mountain View", match: 92 },
    { id: 2, company: "Palantir", role: "Forward Deployed Engineer", location: "New York", match: 88 },
    { id: 3, company: "Tesla", role: "Autopilot Intern", location: "Palo Alto", match: 85 },
  ];

  return (
    <div className="dashboard-layout">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="sidebar-logo">✨ ResumeAI</div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">🏠 Job Feed</Link>
          <Link to="/history" className="nav-item">📜 Past Analyses</Link>
          <Link to="/resumes" className="nav-item">📁 My Resumes</Link>
          <Link to="/settings" className="nav-item">⚙️ Settings</Link>
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">AH</div>
          <div className="user-info">
            <p className="user-name">Astin Huynh</p>
            <p className="user-plan">Pro Plan</p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="dashboard-main">
        <header className="dash-header">
          <div className="search-bar">
            <input type="text" placeholder="Search internships..." />
          </div>
          <button className="primary-btn">+ New Analysis</button>
        </header>

        <section className="dash-content">
          <div className="content-header">
            <h2>Live Internship Feed</h2>
            <p>Targeting your specific tech stack.</p>
          </div>

          <div className="job-grid">
            {mockJobs.map((job) => (
              <motion.div 
                key={job.id} 
                className="job-card"
                whileHover={{ y: -5, borderColor: '#ef4444' }}
              >
                <div className="job-info">
                  <div className="job-main">
                    <h3>{job.role}</h3>
                    <p>{job.company} • {job.location}</p>
                  </div>
                  <div className="job-match">
                    <span className="match-label">Match Score</span>
                    <span className="match-value">{job.match}%</span>
                  </div>
                </div>
                <button className="secondary-btn analyze-btn">Analyze Fit</button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}