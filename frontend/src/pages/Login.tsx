import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="auth-page">
      <div className="main-glow"></div>
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="auth-logo">✨ ResumeAI</Link>
        <h2>Welcome Back</h2>
        <p>Enter your details to access your dashboard.</p>
        
        <form className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="name@company.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="primary-btn auth-btn">Sign In</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}