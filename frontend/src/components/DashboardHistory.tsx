import { useState, useEffect } from "react";
import { API } from "../services/api";

interface HistoryItem {
  _id: string;
  jobTitle: string;
  analysisScore: number;
  createdAt: string;
  applicantSkills: string[];
  postingSkills: string[];
  missingSkills: string[];
}

export default function DashboardHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for the modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // State to track which cards are currently fading out
  const [isDeleting, setIsDeleting] = useState<string[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await API.get("/api/analysis");
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Failed to load your analysis history.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    // Save the ID and instantly close the modal so the UI feels fast
    const idToRemove = deleteId;
    setDeleteId(null);

    try {
      // Tell the backend to delete it
      await API.delete(`/api/analysis/${idToRemove}`);
      
      // Trigger the CSS fade-out animation
      setIsDeleting(prev => [...prev, idToRemove]);
      
      // Wait for the 300ms CSS animation to finish, then remove it from the DOM
      setTimeout(() => {
        setHistory(prev => prev.filter(item => item._id !== idToRemove));
        setIsDeleting(prev => prev.filter(id => id !== idToRemove));
      }, 300);

    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || "Failed to delete.");
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>Loading history...</div>;
  }

  if (error) {
    return <div style={{ color: "#ef4444", textAlign: "center", padding: "2rem" }}>{error}</div>;
  }

  return (
    <div style={{ animation: "slideIn 0.4s ease-out" }}>
      
      {/* Custom confirmation modal overlay */}
      {deleteId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", 
          alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "2rem", borderRadius: "12px",
            textAlign: "center", maxWidth: "400px", width: "90%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>Are you sure?</h3>
            <p style={{ color: "#64748b" }}>This will permanently remove this analysis.</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button 
                onClick={() => setDeleteId(null)} 
                style={{ flex: 1, padding: "0.6rem", cursor: "pointer", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", color: "#475569", fontWeight: "600" }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                style={{ flex: 1, padding: "0.6rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ color: "#1e293b", marginBottom: "1.5rem" }}>Past Analyses</h2>
      
      {history.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
          <h3 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>No Analyses Yet</h3>
          <p style={{ color: "#64748b" }}>Upload a resume and compare it to a job description to see your history here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {history.map((item) => (
            <div 
              key={item._id} 
              style={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease-in-out",
                transform: isDeleting.includes(item._id) ? "scale(0.9)" : "scale(1)",
                opacity: isDeleting.includes(item._id) ? 0 : 1,
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a", lineHeight: "1.3" }}>
                    {item.jobTitle || "Untitled Job"}
                  </h3>
                  
                  <button 
                    onClick={() => setDeleteId(item._id)}
                    style={{ 
                      background: "none", border: "none", cursor: "pointer", 
                      color: "#cbd5e1", fontWeight: "bold", fontSize: "1.2rem",
                      padding: "0 0 0 10px", marginTop: "-5px"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#ef4444"}
                    onMouseOut={(e) => e.currentTarget.style.color = "#cbd5e1"}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
                      {item.createdAt 
                          ? new Date(item.createdAt).toLocaleDateString(undefined, { 
                              year: 'numeric', month: 'short', day: 'numeric' 
                          })
                          : "Recent Analysis"
                      }
                  </p>
                  <span style={{ 
                      backgroundColor: item.analysisScore >= 75 ? "#dcfce7" : "#fef9c3", 
                      color: item.analysisScore >= 75 ? "#166534" : "#854d0e", 
                      padding: "0.25rem 0.75rem", 
                      borderRadius: "999px", 
                      fontWeight: "bold", 
                      fontSize: "0.8rem",
                      marginBottom: "1rem"
                  }}>
                      {item.analysisScore}%
                  </span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "auto" }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#475569", display: "flex", justifyContent: "space-between" }}>
                  <span>Matched: <strong>{item.applicantSkills?.length || 0}</strong></span>
                  <span>Missing: <strong style={{ color: "#ef4444" }}>{item.missingSkills?.length || 0}</strong></span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}