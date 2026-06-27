import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/api";
import ResumeUpload from "../components/ResumeUpload";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Create state to hold the real data from the database
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State to toggle the drag-and-drop zone
  const [showUpload, setShowUpload] = useState(false);

  // When the dashboard loads, fetch the user's data
  useEffect(() => {
    // 1. Instantly load from local storage so the UI is immediately ready
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setLoading(false);
    }

    // 2. Double-check with the database in the background (Security & Syncing)
    const fetchProfile = async () => {
      try {
        const response = await API.get('/api/auth/me');
        setUserData(response.data);
        
        // Keep local storage perfectly in sync with the database
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch user data", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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

  // Get the first initial for the avatar
  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">SMARTRESUME</Link>
        
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
          <h1>Welcome back, {userData?.name?.split(' ')[0] || "there"}</h1>
          {/* 1. Wired up the Header Button */}
          <button 
            className="btn-brand-solid" 
            onClick={() => setShowUpload(true)}
          >
            + New Analysis
          </button>
        </header>

        {/* Top Stats */}
        <div className="dash-stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Scans</div>
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

        {/* Recent Activity / Upload Zone Toggle */}
        <h2 className="dash-section-title">
          {showUpload ? "New Analysis" : "Recent Analyses"}
        </h2>
        
        {/* 2. The Conditional Render for the Upload Zone */}
        {showUpload ? (
          <div className="content-card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h3 style={{ margin: 0, color: '#1e293b' }}>Upload a new resume</h3>
               <button 
                 className="btn-outline-dark" 
                 style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                 onClick={() => setShowUpload(false)}
               >
                 Cancel
               </button>
             </div>
             {/* This renders your new Drag and Drop component */}
             <ResumeUpload />
          </div>
        ) : (
          <div className="content-card">
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              You haven't analyzed any resumes yet this week.
            </p>
            {/* 3. Wired up the Empty State Button */}
            <button 
              className="btn-outline-dark"
              onClick={() => setShowUpload(true)}
            >
              Upload Resume
            </button>
          </div>
        )}
      </main>

    </div>
  );
}