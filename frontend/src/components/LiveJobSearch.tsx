import React, { useState } from "react";
import { API } from "../services/api";

interface LiveJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  postedAt: string;
}

export default function LiveJobSearch() {
  const [what, setWhat] = useState("");
  const [company, setCompany] = useState(""); // NEW STATE
  const [where, setWhere] = useState("Florida");
  const [jobType, setJobType] = useState("any");
  const [jobs, setJobs] = useState<LiveJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const finalWhat = jobType === "internship" 
        ? `${what} internship`.trim() 
        : what;
      
      const typeParam = jobType === "full_time" ? "full_time" : "";

      // NEW: Added company to the API call
      const response = await API.get(
        `/api/search?what=${encodeURIComponent(finalWhat)}&where=${encodeURIComponent(where)}&type=${typeParam}&company=${encodeURIComponent(company)}`
      );
      setJobs(response.data);
    } catch (err) {
      console.error("Search Error:", err);
      setError("Failed to fetch jobs. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ animation: "slideIn 0.4s ease-out", maxWidth: "1100px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#222222", margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "700" }}>
          Find your next role
        </h2>
        <p style={{ color: "#717171", margin: 0, fontSize: "1.1rem" }}>
          Search millions of jobs and internships worldwide.
        </p>
      </div>

      <form 
        onSubmit={handleSearch} 
        style={{ 
          display: "flex", 
          alignItems: "center",
          border: "1px solid #DDDDDD", 
          borderRadius: "60px", 
          padding: "8px 8px 8px 32px", 
          backgroundColor: "white",
          boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
          marginBottom: "3rem",
          maxWidth: "1000px", // WIDENED to accommodate the new input
          margin: "0 auto 3rem auto"
        }}
      >
        {/* Section 1: Role */}
        <div style={{ flex: "1.2", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <label style={{ fontSize: "12px", fontWeight: "800", color: "#222222", marginBottom: "2px", letterSpacing: "0.5px" }}>
            Role
          </label>
          <input 
            placeholder="e.g. Backend..." 
            value={what} 
            onChange={(e) => setWhat(e.target.value)}
            style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", color: "#222222", backgroundColor: "transparent" }}
          />
        </div>
        
        <div style={{ width: "1px", height: "32px", backgroundColor: "#DDDDDD", margin: "0 16px" }}></div>
        
        {/* Section 2: Company (NEW) */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <label style={{ fontSize: "12px", fontWeight: "800", color: "#222222", marginBottom: "2px", letterSpacing: "0.5px" }}>
            Company
          </label>
          <input 
            placeholder="e.g. Google..." 
            value={company} 
            onChange={(e) => setCompany(e.target.value)}
            style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", color: "#222222", backgroundColor: "transparent" }}
          />
        </div>

        <div style={{ width: "1px", height: "32px", backgroundColor: "#DDDDDD", margin: "0 16px" }}></div>

        {/* Section 3: Location */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <label style={{ fontSize: "12px", fontWeight: "800", color: "#222222", marginBottom: "2px", letterSpacing: "0.5px" }}>
            Location
          </label>
          <input 
            placeholder="City, State..." 
            value={where} 
            onChange={(e) => setWhere(e.target.value)}
            style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", color: "#222222", backgroundColor: "transparent" }}
          />
        </div>

        <div style={{ width: "1px", height: "32px", backgroundColor: "#DDDDDD", margin: "0 16px" }}></div>

        {/* Section 4: Job Type */}
        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", marginRight: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: "800", color: "#222222", marginBottom: "2px", letterSpacing: "0.5px" }}>
            Type
          </label>
          <select 
            value={jobType} 
            onChange={(e) => setJobType(e.target.value)}
            style={{ width: "100%", border: "none", outline: "none", fontSize: "14px", color: "#222222", backgroundColor: "transparent", cursor: "pointer", appearance: "none" }}
          >
            <option value="any">Any Type</option>
            <option value="internship">Internship</option>
            <option value="full_time">Full Time</option>
          </select>
        </div>

        {/* Search Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            backgroundColor: "#3498DB", 
            color: "white", 
            border: "none", 
            borderRadius: "50%", 
            width: "48px", 
            height: "48px",
            minWidth: "48px",
            cursor: isLoading ? "wait" : "pointer", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isLoading ? (
            <div style={{ width: "20px", height: "20px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          ) : (
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", fill: "none", height: "16px", width: "16px", stroke: "currentcolor", strokeWidth: "4", overflow: "visible" }}>
              <g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g>
            </svg>
          )}
        </button>
      </form>

      {error && <div style={{ color: "#ef4444", marginBottom: "2rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "8px", textAlign: "center" }}>{error}</div>}

      {jobs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #DDDDDD", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "box-shadow 0.2s ease" }}
                 onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"}
                 onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              <div>
                <div style={{ color: "#717171", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                  {job.company}
                </div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.2rem", color: "#222222", lineHeight: "1.3" }}>
                  {job.title}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#717171", fontSize: "14px", marginBottom: "8px" }}>
                  <svg viewBox="0 0 32 32" style={{ display: "block", height: "12px", width: "12px", fill: "currentColor" }}><path d="M16 0c-6.627 0-12 5.373-12 12 0 8.423 10.457 19.166 11.282 20.021.189.196.448.304.718.304s.529-.108.718-.304c.825-.855 11.282-11.598 11.282-20.021 0-6.627-5.373-12-12-12zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"></path></svg>
                  {job.location}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #DDDDDD", paddingTop: "16px", marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#717171", fontSize: "12px" }}>{job.postedAt}</span>
                <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#222222", fontWeight: "600", fontSize: "14px", textDecorationLine: "underline" }}>
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && jobs.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", backgroundColor: "#F7F7F9", borderRadius: "12px", color: "#717171" }}>
          Start a search to find your perfect match.
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}