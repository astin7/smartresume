import "./Dashboard.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API } from "../services/api";

import ResumeUpload from "../components/ResumeUpload";
import DashboardHistory from "../components/DashboardHistory";
import JobTracker from "../components/JobTracker"; 
import MyResumes from '../components/MyResumes';
import LiveJobSearch from '../components/LiveJobSearch';
import SavedJobs from '../components/SavedJobs'; 
import Settings from '../components/Settings'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [stats, setStats] = useState({ totalScans: 0, avgScore: 0 });
  
  const isJobTracker = location.pathname === "/dashboard/jobs";
  const isResumes = location.pathname === "/dashboard/resumes";
  const isOverview = location.pathname === "/dashboard" || location.pathname === "/dashboard/";
  const isSearch = location.pathname === "/dashboard/search";
  const isSavedJobs = location.pathname === "/dashboard/saved-jobs"; 

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setLoading(false);
    }

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

    const fetchStats = async () => {
      try {
        const response = await API.get('/api/analysis');
        const history = response.data;
        
        const total = history.length;
        // Calculate the average score (protect against dividing by 0 if history is empty)
        const avg = total > 0 
          ? Math.round(history.reduce((sum: number, item: any) => sum + item.analysisScore, 0) / total) 
          : 0;
          
        setStats({ totalScans: total, avgScore: avg });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchProfile();
    fetchStats();
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your dashboard...</div>;
  }

  const initial = userData?.name ? userData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="dashboard-layout">
      
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">SMARTRESUME</Link>
        
        <nav className="dash-nav">
          <Link to="/dashboard" className={`dash-nav-item ${isOverview ? "active" : ""}`}>Overview</Link>
          <Link to="/dashboard/resumes" className={`dash-nav-item ${isResumes ? "active" : ""}`}>My Resumes</Link>
          <Link to="/dashboard/jobs" className={`dash-nav-item ${isJobTracker ? "active" : ""}`}>Job Tracker</Link>
          <Link to="/dashboard/search" className={`dash-nav-item ${isSearch ? "active" : ""}`}>Live Job Search</Link>
          <Link to="/dashboard/saved-jobs" className={`dash-nav-item ${isSavedJobs ? "active" : ""}`}>Saved Jobs</Link>
          
          <div 
            className="dash-nav-item" 
            onClick={() => setIsSettingsOpen(true)}
            style={{ cursor: "pointer" }}
          >
            Settings
          </div>
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

      <main className="dash-main">
        {isJobTracker && <JobTracker />}
        {isResumes && <MyResumes />}
        {isSearch && <LiveJobSearch />}
        {isSavedJobs && <SavedJobs />}
        
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

            <div className="dash-stats-grid">
              <div className="stat-card">
                <div className="stat-title">Total Scans</div>
                <div className="stat-value">{stats.totalScans}</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Avg. Match Score</div>
                <div className="stat-value">{stats.avgScore}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Interviews Landed</div>
                <div className="stat-value">0</div>
              </div>
            </div>
            
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