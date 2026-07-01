import { useState, useRef, useEffect } from "react";
import { API } from "../services/api"; 
import "./ResumeUpload.css"; 

interface AnalysisResult {
  analysisScore: number;
  applicantSkills: string[];
  postingSkills: string[];
  missingSkills: string[];
}

// Blueprint for saved resume items
interface SavedResume {
  _id: string;
  fileName: string;
  isPrimary: boolean;
}

export default function ResumeUpload() {
  // Wizard State 
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  
  // File / Vault State 
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // State to track saved resumes from the vault
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [useUploadedFile, setUseUploadedFile] = useState<boolean>(false);
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Automatically check the database vault when the page opens
  useEffect(() => {
    const fetchVaultResumes = async () => {
      try {
        const response = await API.get("/api/resume");
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSavedResumes(response.data);
          
          // Pre-select whichever resume is marked primary
          const primary = response.data.find((r: SavedResume) => r.isPrimary);
          if (primary) {
            setSelectedResumeId(primary._id);
          } else {
            setSelectedResumeId(response.data[0]._id);
          }
        } else {
          // If the vault is completely empty, default to drag-and-drop mode
          setUseUploadedFile(true);
        }
      } catch (err) {
        console.error("Failed to load vault items inside wizard:", err);
        setUseUploadedFile(true); // Fallback to drag-and-drop if API fails
      }
    };
    fetchVaultResumes();
  }, [step]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => { setToast(null); }, 3000);
  };

  // Drag & Drop Handlers
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

  //  Process Saved selection OR Upload a new PDF 
  const handleNextStepClick = async () => {
    // Scenario: Using a saved resume from the vault dropdown
    if (!useUploadedFile && selectedResumeId) {
      setStep(2);
      return;
    }

    // Scenario: Using a physical dropzone file upload
    if (!file) return;
    
    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("resumePdf", file); 

    try {
      const response = await API.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Update selected ID to the freshly saved resume from the backend response
      if (response.data?.resume?._id) {
        setSelectedResumeId(response.data.resume._id);
      }
      
      showToast("Resume saved to profile", "success");
      setStep(2);
      
    } catch (err: any) {
      console.error(err);
      showToast("Failed to upload the resume", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Analyze against Job Description
  const handleFinalAnalyze = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError("Please provide both a job title and a description.");
      return;
    }
    
    setIsUploading(true);
    setError("");

    try {
      const response = await API.post("/api/analysis/compare", { 
        jobTitle, 
        jobDescription,
        resumeId: selectedResumeId
      });
      
      const analysisData = response.data.analysis;
      setResults(analysisData);
      showToast(`Analysis Complete! Match Score: ${analysisData.analysisScore}%`, "success");
      setStep(3);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to run analysis. Is the server running?");
      showToast("Analysis failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setJobTitle("");
    setJobDescription("");
    setResults(null);
    // If they have vault items, go back to standard vault selection view
    setUseUploadedFile(savedResumes.length === 0);
    setStep(1);
  };

  const getMatchedSkills = () => {
    if (!results) return [];
    return results.postingSkills.filter(
      skill => !results.missingSkills.some(missing => missing.toLowerCase() === skill.toLowerCase())
    );
  };

  return (
    <div className="upload-container">
      
      {/*  UI: Select or upload */}
      {step === 1 && (
        <>
          {!useUploadedFile && savedResumes.length > 0 ? (
            /* Smart vault dropdown overlay */
            <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ color: "#1e293b", margin: "0 0 0.5rem 0" }}>Select a Saved Resume</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                We found existing documents in your vault. Pick one to run an instant analysis.
              </p>
              
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                style={{ width: "100%", maxWidth: "400px", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.95rem", marginBottom: "1.5rem", outline: "none" }}
              >
                {savedResumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.fileName} {resume.isPrimary ? "(Primary Default)" : ""}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "center" }}>
                <button 
                  className="btn-brand-solid" 
                  onClick={handleNextStepClick}
                  style={{ width: "100%", maxWidth: "400px" }}
                >
                  Next: Add Job Details ➔
                </button>
                <button 
                  onClick={() => setUseUploadedFile(true)}
                  className="btn-outline-dark"
                  style={{ width: "100%", maxWidth: "400px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem" }}
                >
                  Upload a new file instead
                </button>
              </div>
            </div>
          ) : (
            /* Drag and drop zone */
            <>
              <div 
                className={`drop-zone ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <h3>{isDragging ? "Drop your resume here" : "Upload your Resume"}</h3>
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
                    onClick={handleNextStepClick}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Next: Add Job Details ➔"}
                  </button>
                </div>
              )}

              {savedResumes.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <button 
                    onClick={() => setUseUploadedFile(false)}
                    className="btn-outline-dark"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", border: "1px solid #cbd5e1", backgroundColor: "white", color: "#475569" }}
                  >
                    Select from Vault
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* UI: Job description */}
      {step === 2 && (
        <div className="job-description-step" style={{ animation: 'slideIn 0.4s ease-out' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>The Target</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Resume selected. Now, provide the title and paste the description of the job you want to apply for.
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
              {isUploading ? "Analyzing..." : "Generate Match Score"}
            </button>
          </div>
        </div>
      )}

      {/* UI: The results */}
      {step === 3 && results && (
        <div className="results-step" style={{ animation: 'slideIn 0.4s ease-out', textAlign: 'left' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, color: '#1e293b' }}>{jobTitle}</h2>
              <p style={{ margin: 0, color: '#64748b', marginTop: '0.25rem' }}>Analysis Complete</p>
            </div>
            <div style={{ backgroundColor: results.analysisScore >= 75 ? '#dcfce7' : '#fef9c3', color: results.analysisScore >= 75 ? '#166534' : '#854d0e', padding: '0.75rem 1.5rem', borderRadius: '999px', fontWeight: 'bold', fontSize: '1.25rem' }}>
              {results.analysisScore}% Match
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Missing Keywords 
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

          <div>
            <h3 style={{ color: '#22c55e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Matched Keywords 
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

      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}