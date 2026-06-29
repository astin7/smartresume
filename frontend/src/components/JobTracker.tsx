import React, { useState, useEffect } from "react";
import { API } from "../services/api";

interface JobItem {
  _id: string;
  companyName: string;
  roleTitle: string;
  status: string;
  jobUrl?: string;
  location?: string;
  createdAt: string;
}

export default function JobTracker() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ companyName: "", roleTitle: "", status: "Bookmarked" });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("/api/joblist");
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.error("Backend sent non-array data:", response.data);
        setJobs([]);
        setError("Backend issue: The server did not return a list of jobs.");
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Could not load jobs. Is the backend server running?");
      setJobs([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/joblist", formData);
      setJobs([response.data, ...jobs]);
      setFormData({ companyName: "", roleTitle: "", status: "Bookmarked" });
      setShowForm(false);
      setError(""); 
    } catch (err) {
      alert("Failed to add job.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this job from your tracker?")) return;
    try {
      await API.delete(`/api/joblist/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  // NEW: Function to update the status in the database
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await API.patch(`/api/joblist/${id}`, { status: newStatus });
      // Update the UI instantly with the new data from the backend
      setJobs(jobs.map(job => job._id === id ? { ...job, status: response.data.status } : job));
      setEditingId(null); // Close the dropdown
    } catch (err) {
      alert("Failed to update status.");
      setEditingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Interviewing': return { bg: '#fef08a', text: '#854d0e' };
      case 'Offer': return { bg: '#dcfce7', text: '#166534' };
      case 'Rejected': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  if (isLoading) return <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading your jobs...</div>;

  return (
    <div style={{ animation: "slideIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#1e293b", margin: 0 }}>Job Tracker</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          {showForm ? "Cancel" : "+ Add Job"}
        </button>
      </div>

      {error && <div style={{ color: "#ef4444", marginBottom: "1rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "6px" }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleAddJob} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <input 
              required placeholder="Company Name" value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              style={{ flex: "1 1 200px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e1" }}
            />
            <input 
              required placeholder="Role Title" value={formData.roleTitle}
              onChange={(e) => setFormData({...formData, roleTitle: e.target.value})}
              style={{ flex: "1 1 200px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e1" }}
            />
            <select 
              value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={{ flex: "1 1 150px", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e1" }}
            >
              <option value="Bookmarked">Bookmarked</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" style={{ padding: "0.5rem 1.5rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Save Job</button>
        </form>
      )}

      {Array.isArray(jobs) && jobs.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {jobs.map((job) => {
            const colors = getStatusColor(job.status);
            return (
              <div 
                key={job._id} 
                style={{ 
                  backgroundColor: "white", 
                  padding: "1.2rem", 
                  borderRadius: "8px", 
                  border: "1px solid #e2e8f0", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  gap: "1.5rem", 
                  flexWrap: "wrap" 
                }}
              >
                <div style={{ minWidth: "150px", flex: "1 1 auto" }}>
                  <h3 style={{ margin: "0 0 0.3rem 0", fontSize: "1.1rem", color: "#0f172a" }}>{job.roleTitle}</h3>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>{job.companyName}</p>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "flex-end",
                  gap: "1.5rem", 
                  flexWrap: "nowrap",
                  flexShrink: 0
                }}>
                  
                  {/* NEW: Click-to-edit logic for the badge */}
                  {editingId === job._id ? (
                    <select
                      value={editStatus}
                      onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                      onBlur={() => setEditingId(null)} // Cancels if they click away
                      style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }}
                      autoFocus
                    >
                      <option value="Bookmarked">Bookmarked</option>
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  ) : (
                    <span 
                      onClick={() => { setEditingId(job._id); setEditStatus(job.status); }}
                      style={{ 
                        backgroundColor: colors.bg, 
                        color: colors.text, 
                        padding: "0.4rem 0.8rem", 
                        borderRadius: "999px", 
                        fontSize: "0.85rem", 
                        fontWeight: "bold", 
                        flexShrink: 0,
                        textAlign: "center",
                        display: "inline-block",
                        cursor: "pointer",
                        border: "1px dashed transparent"
                      }}
                      title="Click to update status"
                      onMouseEnter={(e) => e.currentTarget.style.border = `1px dashed ${colors.text}`}
                      onMouseLeave={(e) => e.currentTarget.style.border = "1px dashed transparent"}
                    >
                      {job.status} ✎
                    </span>
                  )}

                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem", flexShrink: 0, minWidth: "75px", textAlign: "right" }}>
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "New"}
                  </p>
                  <button 
                    onClick={() => handleDelete(job._id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: "1.4rem", padding: "0 0.2rem", lineHeight: 1, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
                  >×</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
          <p style={{ color: "#64748b", margin: 0 }}>You haven't added any jobs yet.</p>
        </div>
      )}
    </div>
  );
}