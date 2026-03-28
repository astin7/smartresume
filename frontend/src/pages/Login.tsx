import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for UI feedback
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(formData);
      
      // What keeps the user logged in
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // If your backend sends user info, save that too
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/dashboard'); // This takes them to the app
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Invalid email or password.");
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
              <span className="dot green" style={{ backgroundColor: '#22c55e' }}></span> 
              Welcome Back
            </div>
            <h1>Login</h1>
            <p>Enter your credentials to access your dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                color: '#e11d48', 
                fontSize: '0.85rem', 
                textAlign: 'center', 
                background: 'rgba(225, 29, 72, 0.1)', 
                padding: '10px', 
                borderRadius: '6px',
                marginBottom: '1rem' 
              }}>
                {error}
              </div>
            )}

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
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="text-red">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}