import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { API } from '../services/api'; 

export default function Dashboard() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null); // State for the PDF file
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchAnalyses();
  }, []);

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
    
    if (!resumeFile) {
      alert("Please upload a PDF resume first!");
      return;
    }

    setIsAnalyzing(true);

    // Prepare Multipart Form Data
    const formData = new FormData();
    formData.append("resume", resumeFile); 
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    try {
      // Send the FormData to the backend
      await API.post('/analysis', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setIsModalOpen(false);
      fetchAnalyses(); 
      // Reset fields
      setJobTitle(""); 
      setJobDescription(""); 
      setResumeFile(null);
    } catch (err) {
      console.error("Analysis error:", err);
      alert("AI Analysis failed. Make sure your backend and Gemini API key are set up.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fadeUp: Variants = {
    offscreen: { opacity: 0, y: 30 },
    onscreen: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
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

      {/* Main content area */}
      <main className="dashboard-main">
        <header className="dash-header">
          <div className="search-bar">
            <input type="text" placeholder="Search internships..." />
          </div>
          <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
            + New Analysis
          </button>
        </header>

        <section className="dash-content">
          <div className="content-header">
            <h2>Your Analysis History</h2>
            <p>Insights based on your actual data.</p>
          </div>

          <div className="job-grid">
            {analyses.length > 0 ? (
              analyses.map((analysis) => (
                <motion.div key={analysis._id} variants={fadeUp} initial="offscreen" animate="onscreen" className="job-card">
                  <div className="job-info">
                    <div className="job-main">
                      <h3 style={{ color: 'white' }}>{analysis.jobTitle}</h3>
                      <p style={{ color: '#94a3b8' }}>{new Date(analysis.createdAt).toLocaleDateString()}</p>
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
        </section>
      </main>

      {/* Upload modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content" 
              style={{ background: '#1a1a1a', padding: '30px', borderRadius: '12px', width: '500px', border: '1px solid #333' }}
            >
              <h2 style={{ color: 'white', marginBottom: '20px' }}>New AI Analysis</h2>
              <form onSubmit={handleStartAnalysis}>
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Job Title</label>
                  <input 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0a0a0a', border: '1px solid #333', color: 'white' }}
                    placeholder="e.g. Google SWE Intern" 
                    value={jobTitle} 
                    onChange={(e) => setJobTitle(e.target.value)} 
                    required 
                  />
                </div>
                <div className="input-group" style={{ marginBottom: '15px' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Job Description</label>
                  <textarea 
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', background: '#0a0a0a', border: '1px solid #333', color: 'white', height: '100px', resize: 'none' }}
                    placeholder="Paste job requirements here..." 
                    value={jobDescription} 
                    onChange={(e) => setJobDescription(e.target.value)} 
                    required 
                  />
                </div>

                {/* File upload zone */}
                <div className="input-group" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                    Upload PDF Resume
                  </label>
                  <div style={{
                    border: '2px dashed #444',
                    padding: '24px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: '#0a0a0a',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files ? e.target.files[0] : null)}
                      style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        opacity: 0, cursor: 'pointer'
                      }}
                    />
                    <p style={{ color: resumeFile ? '#22c55e' : '#64748b', fontSize: '0.9rem', margin: 0 }}>
                      {resumeFile ? `📄 ${resumeFile.name}` : "Click to browse or drag PDF here"}
                    </p>
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