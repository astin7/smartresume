import React, { useState, useEffect } from "react";
import { API } from "../services/api";

interface SavedJob {
  _id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  postedAt: string;
  savedAt: string;
}

interface AIResult {
  score: number;
  feedback: string[];
}

export default function SavedJobs() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal and AI States
  const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);
  const [modalMode, setModalMode] = useState<"match" | "coverLetter" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data states
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await API.get("/api/saved-jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Could not load your saved jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveJob = async (jobId: string) => {
    try {
      await API.delete(`/api/saved-jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job.jobId !== jobId));
    } catch (err) {
      console.error("Failed to remove job", err);
    }
  };

  const handleGenerateAIScore = async (job: SavedJob) => {
    setSelectedJob(job);
    setModalMode("match");
    setAiResult(null);
    setIsGenerating(true);

    try {
      const response = await API.post("/api/ai/match", {
        jobTitle: job.title,
        company: job.company,
        location: job.location
      });
      setAiResult(response.data);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setAiResult({ score: 0, feedback: ["Too many requests! The AI is currently busy. Please wait 30 seconds and try again."] });
      } else {
        setAiResult({ score: 0, feedback: ["Failed to generate score. Please make sure you have uploaded a primary resume and your backend server is running."] });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCoverLetter = async (job: SavedJob) => {
    setSelectedJob(job);
    setModalMode("coverLetter");
    setCoverLetter(null);
    setIsGenerating(true);

    try {
      const response = await API.post("/api/ai/cover-letter", {
        jobTitle: job.title,
        company: job.company,
        location: job.location
      });
      setCoverLetter(response.data.coverLetter);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setCoverLetter("Too many requests! The AI is currently busy. Please wait 30 seconds and try again.");
      } else {
        setCoverLetter("Failed to generate cover letter. Please ensure your backend is running and you have uploaded a primary resume.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const closeAiModal = () => {
    setSelectedJob(null);
    setModalMode(null);
  };

  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      alert("Cover letter copied to clipboard!");
    }
  };

  return (
    <div style={{ animation: "slideIn 0.4s ease-out", maxWidth: "1100px", margin: "0 auto", padding: "1rem", position: "relative" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ color: "#222222", margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "700" }}>Your Saved Roles</h2>
        <p style={{ color: "#717171", margin: 0, fontSize: "1.1rem" }}>Review bookmarked roles and generate custom AI tools.</p>
      </div>

      {error && <div style={{ color: "#ef4444", marginBottom: "2rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "8px", textAlign: "center" }}>{error}</div>}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}><div style={{ width: "40px", height: "40px", border: "4px solid #DDDDDD", borderTopColor: "#3498DB", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} /></div>
      ) : jobs.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {jobs.map((job) => (
            <div key={job.jobId} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #DDDDDD", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ color: "#717171", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", fontWeight: "600" }}>{job.company}</div>
                  <button onClick={() => handleRemoveJob(job.jobId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999999" }}>
                    <svg viewBox="0 0 24 24" style={{ height: "18px", width: "18px", fill: "currentColor" }}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem", color: "#222222", lineHeight: "1.3" }}>{job.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#717171", fontSize: "14px", marginBottom: "8px" }}>
                  📍 {job.location}
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  <button onClick={() => handleGenerateAIScore(job)} style={{ flex: 1, backgroundColor: "#F7F7F9", color: "#222222", border: "1px solid #DDDDDD", padding: "10px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                    Match Score
                  </button>
                  <button onClick={() => handleGenerateCoverLetter(job)} style={{ flex: 1, backgroundColor: "#EBF5FF", color: "#1E40AF", border: "1px solid #BFDBFE", padding: "10px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                    Cover Letter
                  </button>
                </div>

                <div style={{ borderTop: "1px solid #DDDDDD", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#717171", fontSize: "12px" }}>Saved: {new Date(job.savedAt).toLocaleDateString()}</span>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#3498DB", fontWeight: "700", fontSize: "14px" }}>Apply Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem 2rem", backgroundColor: "#F7F7F9", borderRadius: "12px", color: "#717171" }}>No saved roles yet.</div>
      )}

      {/* Dynamic AI Modal */}
      {selectedJob && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "16px", width: "100%", maxWidth: modalMode === "coverLetter" ? "700px" : "550px", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
            
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #DDDDDD", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#222222", fontWeight: "700" }}>
                {modalMode === "match" ? "AI Match Analysis" : "AI Cover Letter"}
              </h3>
              <button onClick={closeAiModal} style={{ background: "#F3F4F6", border: "none", cursor: "pointer", color: "#4B5563", padding: "8px", borderRadius: "50%" }}>
                <svg viewBox="0 0 24 24" style={{ height: "20px", width: "20px", fill: "currentColor" }}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>

            <div style={{ padding: "2rem 1.5rem", overflowY: "auto", flexGrow: 1 }}>
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <p style={{ margin: "0 0 4px 0", color: "#717171", fontSize: "14px", textTransform: "uppercase", fontWeight: "600" }}>{selectedJob.company}</p>
                <h4 style={{ margin: 0, color: "#222222", fontSize: "1.2rem" }}>{selectedJob.title}</h4>
              </div>

              {isGenerating ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <div style={{ width: "40px", height: "40px", border: "4px solid #F3F3F3", borderTopColor: "#3498DB", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem auto" }} />
                  <p style={{ color: "#717171", margin: 0 }}>{modalMode === "match" ? "Analyzing your fit..." : "Drafting your cover letter..."}</p>
                </div>
              ) : modalMode === "match" && aiResult ? (
                <div>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "4rem", fontWeight: "800", color: aiResult.score >= 75 ? "#10B981" : aiResult.score >= 50 ? "#F59E0B" : "#EF4444", lineHeight: "1" }}>
                      {aiResult.score}<span style={{ fontSize: "1.75rem", color: "#999999" }}>/100</span>
                    </div>
                    <div style={{ color: "#717171", fontSize: "14px", marginTop: "12px", fontWeight: "500" }}>Match Score</div>
                  </div>
                  <div style={{ backgroundColor: "#F7F7F9", padding: "1.5rem", borderRadius: "12px" }}>
                    <h5 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", color: "#222222" }}>Feedback & Recommendations</h5>
                    <ul style={{ margin: 0, paddingLeft: "20px", color: "#444444", fontSize: "14px", lineHeight: "1.7" }}>
                      {aiResult.feedback.map((point, index) => <li key={index} style={{ marginBottom: "12px" }}>{point}</li>)}
                    </ul>
                  </div>
                </div>
              ) : modalMode === "coverLetter" && coverLetter ? (
                <div>
                  <div style={{ backgroundColor: "#F7F7F9", padding: "1.5rem", borderRadius: "12px", whiteSpace: "pre-wrap", color: "#333", fontSize: "14px", lineHeight: "1.8", border: "1px solid #E5E7EB" }}>
                    {coverLetter}
                  </div>
                  <button onClick={copyToClipboard} style={{ marginTop: "1rem", width: "100%", backgroundColor: "#1e293b", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                    Copy to Clipboard
                  </button>
                </div>
              ) : null}
            </div>
            
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}