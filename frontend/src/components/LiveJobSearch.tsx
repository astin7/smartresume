import React, { useState, useEffect } from "react";
import { API } from "../services/api";

interface LiveJob {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  postedAt: string;
}

export default function LiveJobSearch() {
  const [query, setQuery] = useState("Software Engineer Intern");
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatically run a search when the component loads
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await API.get(`/api/search?q=${encodeURIComponent(query)}`);
      setJobs(response.data);
    } catch (err) {
      console.error("Search Error:", err);
      setError("Failed to fetch live jobs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ animation: "slideIn 0.4s ease-out" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ color: "#1e293b", margin: "0 0 0.5rem 0" }}>Live Job Search</h2>
        <p style={{ color: "#64748b", margin: 0 }}>
          Discover remote engineering roles and internships instantly.
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. React Developer, Python Intern..."
          style={{ flex: 1, padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "1rem", outline: "none" }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "0 1.5rem", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "8px", cursor: isLoading ? "wait" : "pointer", fontWeight: "bold" }}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div style={{ color: "#ef4444", marginBottom: "1rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "6px" }}>{error}</div>}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Scouring the web for jobs...</div>
      ) : jobs.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", color: "#0f172a", lineHeight: "1.3" }}>
                  {job.title}
                </h3>
                <p style={{ margin: "0 0 1rem 0", color: "#3b82f6", fontWeight: "600", fontSize: "0.95rem" }}>
                  {job.company}
                </p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  {job.location && (
                    <span style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem" }}>
                      📍 {job.location}
                    </span>
                  )}
                  {job.type && (
                    <span style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem" }}>
                      ⏱️ {job.type.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Posted: {job.postedAt}</span>
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "white", backgroundColor: "#3b82f6", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}
                >
                  View Posting
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
          <p style={{ color: "#64748b", margin: 0 }}>No active jobs found for "{query}". Try a broader term.</p>
        </div>
      )}
    </div>
  );
}