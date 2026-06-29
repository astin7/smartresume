import "./Dashboard.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API } from "../services/api";

import ResumeUpload from "../components/ResumeUpload";
import DashboardHistory from "../components/DashboardHistory";
import JobTracker from "../components/JobTracker"; 
import MyResumes from '../components/MyResumes';
import LiveJobSearch from '../components/LiveJobSearch';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Create state to hold the real data from the database
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State to toggle the drag-and-drop zone
  const [showUpload, setShowUpload] = useState(false);
  
  // 1. UPDATED ROUTING CHECKS: We now check exactly which page we are on
  const isJobTracker = location.pathname === "/dashboard/jobs";
  const isResumes = location.pathname === "/dashboard/resumes";
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const isSearch = location.pathname === "/dashboard/search";

  // When the dashboard loads, fetch the user's data
  useEffect(() => {
    // Instantly load from local storage so the UI is immediately ready
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setLoading(false);
    }

    // Double-check with the database in the background
    const fetchProfile = async () => {
      try {
        const response = await API.get('/api/auth/me');
        setUserData(response.data);
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

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your dashboard...</div>;
  }

  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">SMARTRESUME</Link>
        
        <nav className="dash-nav">
          {/* 2. UPDATED SIDEBAR: The active class now strictly follows the URL */}
          <Link to="/dashboard" className={`dash-nav-item ${isOverview ? "active" : ""}`}>Overview</Link>
          <Link to="/dashboard/resumes" className={`dash-nav-item ${isResumes ? "active" : ""}`}>My Resumes</Link>
          <Link to="/dashboard/jobs" className={`dash-nav-item ${isJobTracker ? "active" : ""}`}>Job Tracker</Link>
          <Link to="/dashboard/search" className={`dash-nav-item ${isSearch ? "active" : ""}`}>Live Job Search</Link>
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

        {/* 3. UPDATED MAIN CONTENT RENDER: Dynamically show components based on the URL */}
        {isJobTracker && <JobTracker />}
        {isResumes && <MyResumes />}
        {isSearch && <LiveJobSearch />}
        
        {isOverview && (
          <>
            <header className="dash-header">
              <h1>Welcome back, {userData?.name?.split(' ')[0] || "there"}</h1>
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
            
            {/* The Conditional Render for Upload vs History */}
            {showUpload ? (
              <>
                <h2 className="dash-section-title">New Analysis</h2>
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
                  <ResumeUpload />
                </div>
              </>
            ) : (
              <div style={{ marginTop: '2rem' }}>
                <DashboardHistory />
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
}