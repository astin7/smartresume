import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  
  // Track the input fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Track UI states (loading animation and error messages)
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle typing in the boxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle the button click
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stops the page from refreshing
    setError('');
    setIsLoading(true);

    try {
      // Send the data to your Node.js backend (Port 5050)
      const response = await signupUser(formData);
      
      // If your backend sends a token back immediately on signup, save it!
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard'); // Teleport them to the dashboard
      } else {
        // Otherwise, just send them to the login page to sign in normally
        navigate('/login'); 
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      // Display the error message from your backend, or a generic one
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">✨ ResumeAI</Link>

        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-badge">
              <span className="dot red"></span> 
              New Account
            </div>
            <h1>Create Account</h1>
            <p>Start optimizing your career today.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Show an error message if the backend rejects the signup */}
            {error && <div style={{ color: '#e11d48', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(225, 29, 72, 0.1)', padding: '10px', borderRadius: '6px' }}>{error}</div>}

            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                name="username"
                placeholder="john_smith" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="name@company.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="text-red">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}