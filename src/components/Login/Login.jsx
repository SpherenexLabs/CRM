import { useState } from 'react';
import { LogIn, Lock, User, Mail } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import CustomerRegister from './CustomerRegister';
import './Login.css';

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(credentials.emailOrUsername, credentials.password);
    
    if (!result.success) {
      setError(result.message);
    }
    // If successful, the auth state will update and App.jsx will re-render automatically
  };

  const quickLogin = (role) => {
    const creds = role === 'admin' 
      ? { emailOrUsername: 'admin', password: 'admin123' }
      : { emailOrUsername: 'manager1', password: 'manager123' };
    
    setCredentials(creds);
  };

  if (showRegister) {
    return <CustomerRegister onSwitchToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>INVENLYTICS</h1>
          <p>Multi-Store Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><Mail size={18} /> Email / Username</label>
            <input
              type="text"
              value={credentials.emailOrUsername}
              onChange={(e) => setCredentials({...credentials, emailOrUsername: e.target.value})}
              className="form-control"
              placeholder="Enter email or username"
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={18} /> Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login">
            <LogIn size={20} />
            Login
          </button>
        </form>

        <div className="register-link">
          <p>Don't have an account?</p>
          <button onClick={() => setShowRegister(true)} className="btn-register-link">
            Register as Customer
          </button>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-buttons">
            <button onClick={() => quickLogin('admin')} className="demo-btn">
              <strong>Super Admin</strong>
              <small>username: admin / password: admin123</small>
            </button>
            <button onClick={() => quickLogin('manager')} className="demo-btn">
              <strong>Store Customer</strong>
              <small>username: manager1 / password: manager123</small>
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>&copy; 2025 Spherenex. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;





