import { Link } from "react-router-dom";
import "./Dashboard.css"; // Connecting the Dashboard specific styles

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">RESUMEAI</Link>
        
        <nav className="dash-nav">
          <Link to="/dashboard" className="dash-nav-item active">Overview</Link>
          <Link to="/dashboard/resumes" className="dash-nav-item">My Resumes</Link>
          <Link to="/dashboard/jobs" className="dash-nav-item">Job Tracker</Link>
          <Link to="/settings" className="dash-nav-item">Settings</Link>
        </nav>

        <div className="dash-user">
          <div className="avatar">JD</div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>John Doe</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="dash-main">
        <header className="dash-header">
          <h1>Welcome back, John</h1>
          <button className="btn-brand-solid">+ New Analysis</button>
        </header>

        {/* Top Stats */}
        <div className="dash-stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Scans</div>
            <div className="stat-value">3</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Avg. Match Score</div>
            <div className="stat-value">72%</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Interviews Landed</div>
            <div className="stat-value">1</div>
          </div>
        </div>

        {/* Recent Activity */}
        <h2 className="dash-section-title">Recent Analyses</h2>
        <div className="content-card">
          <p>You haven't analyzed any resumes yet this week.</p>
          <button className="btn-outline-dark">Upload Resume</button>
        </div>
      </main>

    </div>
  );
}