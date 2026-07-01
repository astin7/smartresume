import React, { useEffect, useState } from 'react';
import { API } from '../services/api';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'billing'>('account');
  const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
  
  // Track which specific row is currently being edited
  const [editingField, setEditingField] = useState<'name' | 'email' | 'password' | null>(null);
  
  // Form input states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Feedback States
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the user data and populate the edit fields
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserData(parsed);
      setEditName(parsed.name || "");
      setEditEmail(parsed.email || "");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // --- API HANDLERS ---
  const handleUpdateProfile = async () => {
    setMessage(""); setError("");
    try {
      const res = await API.patch('/api/auth/update-profile', { name: editName, email: editEmail });
      
      setUserData({ name: res.data.name, email: res.data.email });
      const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), name: res.data.name, email: res.data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setEditingField(null); // Close the edit input
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    setMessage(""); setError("");
    try {
      await API.patch('/api/auth/change-password', { currentPassword, newPassword });
      setEditingField(null); // Close the edit input
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password changed successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  const getTabStyle = (tabName: 'account' | 'billing') => ({
    padding: "0.6rem 0.8rem", borderRadius: "6px",
    fontWeight: activeTab === tabName ? "600" : "500",
    color: activeTab === tabName ? "#0f172a" : "#475569",
    backgroundColor: activeTab === tabName ? "#cbd5e1" : "transparent",
    cursor: "pointer", marginBottom: "0.2rem", transition: "background 0.2s"
  });

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, animation: "fadeIn 0.2s ease-out" }} onClick={onClose}>
      <div style={{ backgroundColor: "#f8fafc", width: "90%", maxWidth: "850px", height: "80vh", maxHeight: "700px", borderRadius: "12px", display: "flex", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", animation: "slideUp 0.3s ease-out" }} onClick={(e) => e.stopPropagation()}>
        
        {/* Left Sidebar */}
        <div style={{ width: "240px", backgroundColor: "#e2e8f0", padding: "2.5rem 1rem", display: "flex", flexDirection: "column", flexShrink: 0 }}>
           <h3 style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.8rem", paddingLeft: "0.8rem", fontWeight: "700" }}>User Settings</h3>
           <div style={getTabStyle('account')} onClick={() => { setActiveTab('account'); setMessage(""); setError(""); setEditingField(null); }}>My Account</div>
           <div style={getTabStyle('billing')} onClick={() => { setActiveTab('billing'); setMessage(""); setError(""); setEditingField(null); }}>Billing & Plans</div>
           <div style={{ height: "1px", backgroundColor: "#cbd5e1", margin: "1rem 0.8rem" }}></div>
           <div onClick={handleLogout} style={{ padding: "0.6rem 0.8rem", borderRadius: "6px", fontWeight: "600", color: "#ef4444", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>Log Out</div>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, padding: "3rem", position: "relative", overflowY: "auto", backgroundColor: "white" }}>
          <button onClick={onClose} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "2px solid #e2e8f0", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "1.2rem", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>

          {/* Feedback Messages */}
          {message && <div style={{ padding: "12px 16px", backgroundColor: "#dcfce7", color: "#166534", borderRadius: "6px", marginBottom: "1.5rem", border: "1px solid #bbf7d0", fontWeight: "500", fontSize: "0.95rem" }}>{message}</div>}
          {error && <div style={{ padding: "12px 16px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "1.5rem", border: "1px solid #fecaca", fontWeight: "500", fontSize: "0.95rem" }}>{error}</div>}

          {activeTab === 'account' ? (
            <div>
              <h2 style={{ color: "#0f172a", margin: "0 0 2rem 0", fontSize: "1.5rem" }}>My Account</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* USERNAME ROW */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Username</label>
                    {editingField === 'name' ? (
                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #3b82f6", outline: "none", width: "100%", maxWidth: "300px" }} autoFocus />
                    ) : (
                      <div style={{ color: "#0f172a", fontWeight: "500", fontSize: "1.1rem" }}>{userData?.name || "User"}</div>
                    )}
                  </div>
                  {editingField === 'name' ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => setEditingField(null)} style={{ padding: "0.4rem 1rem", backgroundColor: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                      <button onClick={handleUpdateProfile} style={{ padding: "0.4rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Save</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField('name')} style={{ padding: "0.4rem 1rem", backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                  )}
                </div>

                {/* EMAIL ROW */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                    {editingField === 'email' ? (
                      <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #3b82f6", outline: "none", width: "100%", maxWidth: "300px" }} autoFocus />
                    ) : (
                      <div style={{ color: "#0f172a", fontWeight: "500", fontSize: "1.1rem" }}>{userData?.email || "Loading..."}</div>
                    )}
                  </div>
                  {editingField === 'email' ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => setEditingField(null)} style={{ padding: "0.4rem 1rem", backgroundColor: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                      <button onClick={handleUpdateProfile} style={{ padding: "0.4rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Save</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField('email')} style={{ padding: "0.4rem 1rem", backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                  )}
                </div>

                {/* PASSWORD ROW */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
                    {editingField === 'password' ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "300px" }}>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #3b82f6", outline: "none", width: "100%" }} autoFocus />
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" style={{ padding: "0.6rem", borderRadius: "6px", border: "1px solid #3b82f6", outline: "none", width: "100%" }} />
                      </div>
                    ) : (
                      <div style={{ color: "#0f172a", fontWeight: "500", fontSize: "1.5rem", letterSpacing: "0.1em", transform: "translateY(-6px)" }}>••••••••</div>
                    )}
                  </div>
                  {editingField === 'password' ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => setEditingField(null)} style={{ padding: "0.4rem 1rem", backgroundColor: "white", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "4px", fontWeight: "600", cursor: "pointer", height: "fit-content" }}>Cancel</button>
                      <button onClick={handleChangePassword} style={{ padding: "0.4rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer", height: "fit-content" }}>Save</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingField('password')} style={{ padding: "0.4rem 1rem", backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Change Password</button>
                  )}
                </div>

                {/* PLAN ROW */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subscription Plan</label>
                    <div style={{ display: "inline-block", backgroundColor: "#e0f2fe", color: "#0284c7", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "700" }}>Free Tier</div>
                  </div>
                  <button onClick={() => setActiveTab('billing')} style={{ padding: "0.4rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", fontWeight: "600", cursor: "pointer" }}>Upgrade</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ color: "#0f172a", margin: "0 0 2rem 0", fontSize: "1.5rem" }}>Billing & Plans</h2>
              
              <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#0f172a", fontSize: "1.1rem" }}>Current Plan: Free</h3>
                <p style={{ margin: "0 0 1rem 0", color: "#64748b", fontSize: "0.9rem" }}>You are currently on the free tier. Upgrade to Pro for unlimited AI scans and advanced features.</p>
                <div style={{ display: "inline-block", backgroundColor: "#e2e8f0", color: "#475569", padding: "4px 12px", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "600" }}>
                  $0.00 / month
                </div>
              </div>

              <h3 style={{ margin: "0 0 1rem 0", color: "#0f172a", fontSize: "1.1rem" }}>Upgrade Options</h3>
              
              <div style={{ border: "2px solid #3b82f6", borderRadius: "8px", padding: "1.5rem", position: "relative" }}>
                <div style={{ position: "absolute", top: "-12px", right: "20px", backgroundColor: "#3b82f6", color: "white", fontSize: "0.75rem", fontWeight: "bold", padding: "4px 10px", borderRadius: "12px", textTransform: "uppercase" }}>Recommended</div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", color: "#0f172a" }}>Pro Tier</h4>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", marginBottom: "1rem" }}>$20 <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500" }}>/ month</span></div>
                
                <ul style={{ paddingLeft: "20px", color: "#475569", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: "1.6" }}>
                  <li>Unlimited AI Resume Scans</li>
                  <li>Deep JD Alignment Analysis</li>
                  <li>Full Live Internship Feed</li>
                  <li>Bullet Point Rewriter</li>
                </ul>
                
                <button style={{ width: "100%", padding: "0.75rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>Upgrade to Pro</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
    </div>
  );
}