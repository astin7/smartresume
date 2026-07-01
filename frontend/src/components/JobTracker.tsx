import React, { useState, useEffect } from "react";
import { API } from "../services/api";
import { DndContext, DragEndEvent, DragStartEvent, closestCorners, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// 1. Interfaces & Constants
interface JobItem {
  _id: string;
  companyName: string;
  roleTitle: string;
  status: string;
  jobUrl?: string;
  location?: string;
  createdAt?: string;
}

const COLUMNS = ["Bookmarked", "Applied", "Interviewing", "Offer", "Rejected"];

// 2. Sub-Component: The Draggable Job Card
const DraggableCard = ({ job, onDelete, isOverlay = false }: { job: JobItem; onDelete?: (id: string) => void; isOverlay?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    // Hide the original card when dragging to leave an empty placeholder. Show the overlay fully.
    opacity: isDragging && !isOverlay ? 0 : 1,
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "8px",
    // Give the floating overlay a heavier shadow and slight zoom
    boxShadow: isOverlay ? "0 20px 25px -5px rgba(0,0,0,0.15), 0 10px 10px -5px rgba(0,0,0,0.04)" : "0 1px 2px 0 rgba(0,0,0,0.05)",
    transformOrigin: "center",
    scale: isOverlay ? "1.02" : "1",
    border: isOverlay ? "1px solid #3b82f6" : "1px solid #e2e8f0",
    cursor: isOverlay ? "grabbing" : "grab",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    zIndex: isDragging || isOverlay ? 100 : 1,
    position: "relative" as const,
    transition: isOverlay ? "none" : "opacity 0.2s",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h4 style={{ margin: 0, color: "#0f172a", fontSize: "1rem", fontWeight: "600", lineHeight: "1.2" }}>
          {job.roleTitle}
        </h4>
        {onDelete && (
          <button
            onPointerDown={(e) => e.stopPropagation()} // Prevents the drag logic from stealing the click
            onClick={() => onDelete(job._id)}
            style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: "1.2rem", padding: "0 4px", lineHeight: "1" }}
            title="Delete Job"
          >
            ×
          </button>
        )}
      </div>
      <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>{job.companyName}</p>
      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "New"}
      </div>
    </div>
  );
};

// 3. Sub-Component: The Droppable Column
const DroppableColumn = ({ status, jobs, onDelete }: { status: string; jobs: JobItem[]; onDelete: (id: string) => void }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: "1 1 0", // Makes the columns share the screen width equally
        minWidth: "200px", // Prevents columns from getting too squished on very small screens
        // Highlight the column with a dashed border when hovering over it
        backgroundColor: isOver ? "#e2e8f0" : "#f8fafc",
        border: isOver ? "2px dashed #94a3b8" : "2px dashed transparent",
        borderRadius: "12px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 250px)",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", padding: "0 0.5rem" }}>
        <h3 style={{ margin: 0, fontSize: "0.95rem", color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "700" }}>
          {status}
        </h3>
        <span style={{ backgroundColor: "#e2e8f0", color: "#475569", fontSize: "0.8rem", padding: "2px 8px", borderRadius: "12px", fontWeight: "bold" }}>
          {jobs.length}
        </span>
      </div>

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {jobs.map((job) => (
          <DraggableCard key={job._id} job={job} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

// 4. Main Job Tracker Component
export default function JobTracker() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ companyName: "", roleTitle: "", status: "Bookmarked" });

  // NEW: State to track which card is currently being dragged
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("/api/joblist");
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
        setError("Backend issue: The server did not return a list of jobs.");
      }
    } catch (err) {
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
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null); // Clear the active ID to remove the overlay
    const { active, over } = event;

    // If dropped outside a valid column, do nothing
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as string;

    const activeJob = jobs.find((job) => job._id === jobId);
    if (!activeJob || activeJob.status === newStatus) return;

    // 1. Optimistic UI Update: Instantly snap the card to the new column
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job._id === jobId ? { ...job, status: newStatus } : job))
    );

    // 2. Background Update: Save to MongoDB
    try {
      await API.patch(`/api/joblist/${jobId}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status on server", err);
      alert("Failed to save status change. Please refresh.");
    }
  };

  // Find the data for the card currently being dragged
  const activeJob = activeId ? jobs.find((job) => job._id === activeId) : null;

  if (isLoading) return <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading your Kanban Board...</div>;

  return (
    <div style={{ animation: "slideIn 0.4s ease-out", paddingBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#1e293b", margin: "0 0 0.5rem 0", fontSize: "2rem" }}>Job Tracker</h2>
          <p style={{ color: "#64748b", margin: 0 }}>Drag and drop roles to track your application pipeline.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "0.6rem 1.2rem", backgroundColor: showForm ? "#ef4444" : "#1e293b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "background-color 0.2s" }}
        >
          {showForm ? "Cancel" : "+ Add Job"}
        </button>
      </div>

      {error && <div style={{ color: "#ef4444", marginBottom: "1rem", padding: "1rem", backgroundColor: "#fee2e2", borderRadius: "6px" }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleAddJob} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <input
              required
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              style={{ flex: "1 1 200px", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
            />
            <input
              required
              placeholder="Role Title"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              style={{ flex: "1 1 200px", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ flex: "1 1 150px", padding: "0.6rem", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" }}
            >
              {COLUMNS.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <button type="submit" style={{ padding: "0.6rem 1.5rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            Save Job
          </button>
        </form>
      )}

      {/* THE KANBAN BOARD */}
      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}>
          {COLUMNS.map((columnStatus) => {
            const columnJobs = jobs.filter((job) => job.status === columnStatus);
            return (
              <DroppableColumn 
                key={columnStatus} 
                status={columnStatus} 
                jobs={columnJobs} 
                onDelete={handleDelete} 
              />
            );
          })}
        </div>

        {/* THE DRAG OVERLAY */}
        <DragOverlay>
          {activeJob ? <DraggableCard job={activeJob} isOverlay={true} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}