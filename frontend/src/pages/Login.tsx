import { Link } from "react-router-dom";
import "./Auth.css"; // Connecting our new CSS file!

export default function Login() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">RESUMEAI</Link>
          <h1>Welcome back</h1>
          <p>Log in to access your dashboard.</p>
        </div>

        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
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