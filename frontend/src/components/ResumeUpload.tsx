import { useState, useRef } from "react";
import { API } from "../services/api"; 
import "./ResumeUpload.css"; 

// Define what our API response looks like
interface AnalysisResult {
  analysisScore: number;
  applicantSkills: string[];
  postingSkills: string[];
  missingSkills: string[];
}

export default function ResumeUpload() {
  // --- Wizard State ---
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  
  // --- File State ---
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => { setToast(null); }, 3000);
  };

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false); setError("");
    validateAndSetFile(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files) validateAndSetFile(e.target.files);
  };

  const validateAndSetFile = (files: FileList) => {
    const selectedFile = files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid PDF document.");
    }
  };

  const triggerFileInput = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  // --- STEP 1: Upload the PDF ---
  const handleUploadClick = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resumePdf", file); 

    try {
      await API.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      showToast("Resume saved to profile!", "success");
      setStep(2);
      
    } catch (err: any) {
      console.error(err);
      showToast("Failed to upload the resume.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // --- STEP 2: Analyze against Job Description ---
  const handleFinalAnalyze = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError("Please provide both a job title and a description!");
      return;
    }
    
    setIsUploading(true);
    setError("");

    try {
      const response = await API.post("/api/analysis/compare", { 
        jobTitle, 
        jobDescription 
      });
      
      const analysisData = response.data.analysis;
      setResults(analysisData);
      showToast(`Analysis Complete! Match Score: ${analysisData.analysisScore}%`, "success");
      
      // Move to the final Results step!
      setStep(3);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to run analysis. Is the server running?");
      showToast("Analysis failed.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setJobTitle("");
    setJobDescription("");
    setResults(null);
    setStep(1);
  };

  // --- Helper to calculate matched skills ---
  const getMatchedSkills = () => {
    if (!results) return [];
    // Matched skills are posting skills that are NOT in the missing skills array
    return results.postingSkills.filter(
      skill => !results.missingSkills.some(missing => missing.toLowerCase() === skill.toLowerCase())
    );
  };

  return (
    <div className="upload-container">
      
      {/* --- STEP 1 UI: THE DROP ZONE --- */}
      {step === 1 && (
        <>
          <div 
            className={`drop-zone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">📄</div>
            <h3>{isDragging ? "Drop your resume here!" : "Upload your Resume"}</h3>
            <p>Drag and drop your PDF file here, or click to browse.</p>
            
            <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
            <button className="btn-outline-dark" onClick={triggerFileInput}>Select PDF</button>
          </div>

          {error && <div className="upload-error">{error}</div>}

          {file && (
            <div className="file-preview">
              <span className="file-name">{file.name}</span>
              <button 
                className="btn-brand-solid submit-resume" 
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Next: Add Job Details ➔"}
              </button>
            </div>
          )}
        </>
      )}

      {/* --- STEP 2 UI: THE JOB DESCRIPTION --- */}
      {step === 2 && (
        <div className="job-description-step" style={{ animation: 'slideIn 0.4s ease-out' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>The Target</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Your resume was saved. Now, provide the title and paste the description of the job you want to apply for.
          </p>
          
          {error && <div className="upload-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <input 
            type="text"
            value={jobTitle}
            onChange={(e) => { setJobTitle(e.target.value); setError(""); }}
            placeholder="Job Title (e.g. Software Engineer Intern)"
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
              border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'inherit', marginBottom: '1rem'
            }}
          />

          <textarea 
            value={jobDescription}
            onChange={(e) => { setJobDescription(e.target.value); setError(""); }}
            placeholder="Paste the full job description here (responsibilities, requirements, etc.)..."
            style={{
              width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '8px',
              border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1.5rem'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-outline-dark" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-brand-solid" onClick={handleFinalAnalyze} disabled={isUploading}>
              {isUploading ? "Analyzing..." : "⚡ Generate Match Score"}
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3 UI: THE RESULTS --- */}
      {step === 3 && results && (
        <div className="results-step" style={{ animation: 'slideIn 0.4s ease-out', textAlign: 'left' }}>
          
          {/* Header & Score */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, color: '#1e293b' }}>{jobTitle}</h2>
              <p style={{ margin: 0, color: '#64748b', marginTop: '0.25rem' }}>Analysis Complete</p>
            </div>
            <div style={{ backgroundColor: results.analysisScore >= 75 ? '#dcfce7' : '#fef9c3', color: results.analysisScore >= 75 ? '#166534' : '#854d0e', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '1.25rem' }}>
              {results.analysisScore}% Match
            </div>
          </div>

          {/* Missing Skills Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠️ Missing Keywords 
              <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b' }}>({results.missingSkills.length})</span>
            </h3>
            {results.missingSkills.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>Your resume hit all the major keywords. Great job!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {results.missingSkills.map((skill, index) => (
                  <span key={index} style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Matched Skills Section */}
          <div>
            <h3 style={{ color: '#22c55e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✅ Matched Keywords 
              <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b' }}>({getMatchedSkills().length})</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {getMatchedSkills().map((skill, index) => (
                <span key={index} style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '500' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button className="btn-outline-dark" onClick={handleStartOver} style={{ width: '100%' }}>
              Analyze Another Job
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}