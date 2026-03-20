import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // for now, just simulating a successful signup
    console.log("Signing up with:", { username, email, password });
    navigate("/dashboard"); 
  };

  return (
    <div className="auth-page">
      <div className="main-glow"></div>
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="auth-logo">✨ ResumeAI</Link>
        <h2>Create Account</h2>
        <p>Start optimizing your career today.</p>
        
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="john_doe" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="primary-btn auth-btn">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}