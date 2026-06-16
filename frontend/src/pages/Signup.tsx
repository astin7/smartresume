import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../services/api"; // Your axios setup from earlier!
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();
  
  // 1. Create state to hold the form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  // 2. Handle typing in the inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing
    setError("");

    try {
      // Send the data to your backend route (adjust the URL if your backend route is different)
      const response = await API.post('/auth/register', formData);
      
      console.log("Signup successful!", response.data);
      // Redirect the user to the login page or dashboard after success
      navigate("/login");
      
    } catch (err: any) {
      // If the backend sends back an error (e.g., "Email already in use")
      setError(err.response?.data?.message || "Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">RESUMEAI</Link>
          <h1>Create an account</h1>
          <p>Start optimizing your resume for free.</p>
        </div>

        {/* 4. Connect the form to the submit handler */}
        <form className="auth-form" onSubmit={handleSubmit}>
          
          {/* Display backend errors if there are any */}
          {error && <div style={{ color: "red", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe" 
              required 
            />
          </div>
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
              placeholder="Create a strong password" 
              required 
            />
          </div>
          
          <button type="submit" className="btn-brand-solid auth-submit">Create account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </div>
      </div>
    </div>
  );
}