import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Create state to hold the real data from the database
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // When the dashboard loads, fetch the user's data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Change '/auth/me' to whatever your backend route is for fetching user details
        const response = await API.get('/api/auth/me');
        console.log("Raw Backend Data:", response.data); // <-- Add this!
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        // If the token is invalid or expired, clear it and kick them to login
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Show a loading screen while we wait for the database
  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your dashboard...</div>;
  }

  // Get the first initial for the avatar (e.g., "Astin" -> "A")
  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">EVEREST</Link>
        
        <nav className="dash-nav">
          <Link to="/dashboard" className="dash-nav-item active">Overview</Link>
          <Link to="/dashboard/resumes" className="dash-nav-item">My Resumes</Link>
          <Link to="/dashboard/jobs" className="dash-nav-item">Job Tracker</Link>
          <Link to="/settings" className="dash-nav-item">Settings</Link>
        </nav>

        <div className="dash-user">
          <div className="avatar">{initial}</div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {userData?.name || "User"}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Free Plan
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="dash-main">
        <header className="dash-header">
          {/* Dynamically insert their actual name */}
          <h1>Welcome back, {userData?.name?.split(' ')[0] || "there"}</h1>
          <button className="btn-brand-solid">+ New Analysis</button>
        </header>

        {/* Top Stats */}
        <div className="dash-stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Scans</div>
            {/* Replace with real dynamic data once you have resumes saving in the DB */}
            <div className="stat-value">{userData?.scans || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Avg. Match Score</div>
            <div className="stat-value">0%</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Interviews Landed</div>
            <div className="stat-value">0</div>
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