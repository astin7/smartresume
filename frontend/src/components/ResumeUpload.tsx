import { useState, useRef } from "react";
import { API } from "../services/api"; 
import "./ResumeUpload.css"; 

export default function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // --- NEW: Toast Notification State ---
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to show a toast and hide it after 3 seconds
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const droppedFiles = e.dataTransfer.files;
    validateAndSetFile(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files) {
      validateAndSetFile(e.target.files);
    }
  };

  const validateAndSetFile = (files: FileList) => {
    const selectedFile = files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid PDF document.");
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resumePdf", file); 

    try {
      const response = await API.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      console.log("Server response:", response.data);
      
      // --- REPLACED ALERT WITH TOAST ---
      showToast("Success! The SmartResume backend caught your PDF!", "success");
      
    } catch (err: any) {
      console.error(err);
      // --- REPLACED GENERIC ERROR WITH TOAST ---
      showToast("Failed to upload the resume. Is the backend running?", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div 
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">📄</div>
        <h3>{isDragging ? "Drop your resume here!" : "Upload your Resume"}</h3>
        <p>Drag and drop your PDF file here, or click to browse.</p>
        
        <input 
          type="file" 
          accept=".pdf" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          style={{ display: "none" }} 
        />
        
        <button className="btn-outline-dark" onClick={triggerFileInput}>
          Select PDF
        </button>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {file && (
        <div className="file-preview">
          <span className="file-name">{file.name}</span>
          <button 
            className="btn-brand-solid submit-resume" 
            onClick={handleAnalyzeClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Analyze Resume"}
          </button>
        </div>
      )}

      {/* --- NEW: The actual Toast UI that pops up on the screen --- */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}