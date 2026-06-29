import React, { useState, useEffect, useRef } from "react";
import { API } from "../services/api";

interface ResumeItem {
  _id: string;
  fileName: string;
  isPrimary: boolean;
  scanCount: number;
  createdAt: string;
}

export default function MyResumes() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await API.get("/api/resume");
      setResumes(response.data);
    } catch (err) {
      console.error("Fetch resumes error:", err);
      setError("Failed to load your resumes.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. REUSABLE UPLOAD LOGIC
  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("resumePdf", file);

    try {
      const response = await API.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setResumes([response.data.resume, ...resumes]);
      
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload resume. Make sure the backend is running and the file is under 5MB.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle standard button click upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  // 2. DRAG AND DROP HANDLERS
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // 3. SET PRIMARY LOGIC
  const handleSetPrimary = async (id: string) => {
    try {
      await API.patch(`/api/resume/${id}/primary`);
      setResumes(resumes.map(r => ({
        ...r,
        isPrimary: r._id === id
      })));
    } catch (err) {
      alert("Failed to update primary status.");
    }
  };

  // 4. DELETE LOGIC
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await API.delete(`/api/resume/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      alert("Failed to delete resume.");
    }
  };

  if (isLoading) return <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading your vault...</div>;

  return (
    <div style={{ animation: "slideIn 0.4s ease-out" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#1e293b", margin: 0 }}>My Resumes</h2>
        
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          style={{ display: "none" }} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ padding: "0.5rem 1rem", backgroundColor: isUploading ? "#94a3b8" : "#1e293b", color: "white", border: "none", borderRadius: "6px", cursor: isUploading ? "wait" : "pointer", fontWeight: "bold" }}
        >
          {isUploading ? "Uploading..." : "+ Upload PDF"}
        </button>
      </div>

      {error && <div style={{ color: "#ef4444", marginBottom: "1rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "6px" }}>{error}</div>}

      {resumes.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {resumes.map((resume) => (
            <div key={resume._id} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", border: resume.isPrimary ? "2px solid #3b82f6" : "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "150px" }}>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "#0f172a", wordBreak: "break-word", paddingRight: "10px" }}>
                    {resume.fileName}
                  </h3>
                  {resume.isPrimary && (
                    <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", flexShrink: 0 }}>
                      Primary
                    </span>
                  )}
                </div>
                <p style={{ margin: "0 0 0.2rem 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
                  Total Scans: <strong>{resume.scanCount}</strong>
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
                {!resume.isPrimary ? (
                  <button 
                    onClick={() => handleSetPrimary(resume._id)}
                    style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold", padding: 0 }}
                  >
                    Make Primary
                  </button>
                ) : (
                  <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Active Default</span>
                )}
                
                <button 
                  onClick={() => handleDelete(resume._id)}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.9rem", padding: 0 }}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* DRAG AND DROP ZONE */
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ 
            textAlign: "center", 
            padding: "4rem 2rem", 
            backgroundColor: isDragging ? "#eff6ff" : "#f8fafc", 
            borderRadius: "8px", 
            border: isDragging ? "2px dashed #3b82f6" : "2px dashed #cbd5e1",
            transition: "all 0.2s ease"
          }}
        >
          <p style={{ color: isDragging ? "#1e40af" : "#64748b", margin: "0 0 1rem 0", fontSize: "1.1rem" }}>
            {isDragging ? "Drop your PDF here!" : "Drag & drop a PDF, or click to browse."}
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ padding: "0.6rem 1.2rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: isUploading ? "wait" : "pointer", fontWeight: "bold" }}
          >
            {isUploading ? "Uploading..." : "Upload your first resume"}
          </button>
        </div>
      )}
    </div>
  );
}