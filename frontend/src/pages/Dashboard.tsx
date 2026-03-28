import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { API } from '../services/api'; 

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    fetchAnalyses();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const fetchAnalyses = async () => {
    try {
      const response = await API.get('/analysis');
      setAnalyses(response.data);
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please upload a PDF resume first!");

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", resumeFile); 
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await API.post('/analysis', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setIsModalOpen(false);
      setSelectedAnalysis(response.data.analysis); 
      fetchAnalyses(); 
      setJobTitle(""); setJobDescription(""); setResumeFile(null);
    } catch (err) {
      console.error("Analysis error:", err);
      alert("Analysis failed. Check your Backend/API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fadeUp: Variants = {
    offscreen: { opacity: 0, y: 30 },
    onscreen: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">✨ ResumeAI</div>
        <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Link to="/dashboard" className="nav-item active">🏠 Job Feed</Link>
          <Link to="/history" className="nav-item">📜 Past Analyses</Link>
          <Link to="/resumes" className="nav-item">📁 My Resumes</Link>
          <Link to="/settings" className="nav-item">⚙️ Settings</Link>
          
          <button onClick={handleLogout} className="nav-item logout-btn" style={{ marginTop: 'auto', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#ef4444' }}>
            🚪 Logout
          </button>
        </nav>
        
        <div className="sidebar-user">
          <div className="user-avatar">{userData ? getInitials(userData.name) : "??"}</div>
          <div className="user-info">
            <p className="user-name">{userData ? userData.name : "Loading..."}</p>
            <p className="user-plan">Pro Plan</p>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dash-header">
          <div className="search-bar">
            <input type="text" placeholder="Search internships..." />
          </div>
          <button className="primary-btn" onClick={() => { setSelectedAnalysis(null); setIsModalOpen(true); }}>
            + New Analysis
          </button>
        </header>

        <section className="dash-content">
          {selectedAnalysis ? (
            /* detail view */
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="analysis-detail">
              <button className="secondary-btn" onClick={() => setSelectedAnalysis(null)} style={{ marginBottom: '20px' }}>
                ← Back to Feed
              </button>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ color: 'white', fontSize: '2rem', margin: '0 0 8px 0' }}>{selectedAnalysis.jobTitle}</h1>
                  <p style={{ color: '#94a3b8' }}>
                    Analyzed on {selectedAnalysis.createdAt ? new Date(selectedAnalysis.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Just now'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 'bold' }} className="text-gradient-red">
                    {selectedAnalysis.analysisScore}%
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Match Score</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #222' }}>
                  <h3 style={{ color: '#22c55e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Matched Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedAnalysis.applicantSkills?.map((skill: string) => (
                      <span key={skill} style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #222' }}>
                  <h3 style={{ color: '#ef4444', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>⚠ Missing Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(() => {
                        const appSkills = selectedAnalysis.applicantSkills || [];
                        const postSkills = selectedAnalysis.postingSkills || [];
                        const missing = postSkills.filter((ps: string) => !appSkills.some((as: string) => as.toLowerCase() === ps.toLowerCase()));
                        return missing.length > 0 ? missing.map((skill: string) => (
                          <span key={skill} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{skill}</span>
                        )) : <p style={{ color: '#64748b' }}>No missing skills detected!</p>
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Grid view */
            <>
              <div className="content-header">
                <h2>Your Analysis History</h2>
                <p>Insights based on your actual data.</p>
              </div>

              <div className="job-grid">
                {analyses.length > 0 ? (
                  analyses.map((analysis) => (
                    <motion.div 
                      key={analysis._id} 
                      variants={fadeUp} 
                      initial="offscreen" 
                      animate="onscreen" 
                      className="job-card"
                      onClick={() => setSelectedAnalysis(analysis)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="job-info">
                        <div className="job-main">
                          <h3 style={{ color: 'white' }}>{analysis.jobTitle}</h3>
                          <p style={{ color: '#94a3b8' }}>
                            {analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </p>
                        </div>
                        <div className="job-match">
                          <span className="match-label" style={{ color: '#64748b' }}>Match Score</span>
                          <span className="match-value text-gradient-red">{analysis.analysisScore || 0}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', width: '100%' }}>
                    {isLoading ? "Loading..." : "No analyses yet. Start one above!"}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="modal-content" style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '500px', border: '1px solid #333' }}>
              <h2 style={{ color: 'white', marginBottom: '20px' }}>New AI Analysis</h2>
              <form onSubmit={handleStartAnalysis}>
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Job Title</label>
                  <input style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0a0a0a', border: '1px solid #333', color: 'white' }} placeholder="e.g. Google SWE Intern" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                </div>
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Job Description</label>
                  <textarea style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0a0a0a', border: '1px solid #333', color: 'white', height: '100px', resize: 'none' }} placeholder="Paste job requirements here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required />
                </div>
                <div className="input-group" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Upload PDF Resume</label>
                  <div style={{ border: '2px dashed #444', padding: '24px', borderRadius: '8px', textAlign: 'center', background: '#0a0a0a', cursor: 'pointer', position: 'relative' }}>
                    <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    <p style={{ color: resumeFile ? '#22c55e' : '#64748b', fontSize: '0.9rem', margin: 0 }}>{resumeFile ? `📄 ${resumeFile.name}` : "Click to browse or drag PDF here"}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="primary-btn" style={{ flex: 1 }} disabled={isAnalyzing}>
                    {isAnalyzing ? "Gemini is Thinking..." : "Start Analysis"}
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}