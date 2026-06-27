import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/api"; // Your axios setup
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  
  // State for form inputs and error handling
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  // Handle typing in inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Send login request to the backend
      const response = await API.post('/api/auth/login', formData);
      
      console.log("Login successful!", response.data);
      
      // Optional: If your backend sends back a JWT token, save it to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Redirect to the dashboard upon success
      navigate("/dashboard");
      
    } catch (err: any) {
      // Catch backend errors (e.g., "Invalid credentials", "User not found")
      // We check for err.response.data.message, otherwise show a generic error
      setError(err.response?.data?.message || "Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">EVEREST</Link>
          <h1>Welcome back</h1>
          <p>Log in to access your dashboard.</p>
        </div>

        {/* Connect the form to our submit handler */}
        <form className="auth-form" onSubmit={handleSubmit}>
          
          {/* Error Message Display */}
          {error && (
            <div style={{ 
              backgroundColor: "#fef2f2", 
              color: "#dc2626", 
              padding: "10px 14px", 
              borderRadius: "6px", 
              fontSize: "0.85rem",
              fontWeight: 500,
              border: "1px solid #f87171" 
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button type="submit" className="btn-brand-solid auth-submit">Log in</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}