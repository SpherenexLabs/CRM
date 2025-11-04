import { useState } from 'react';
import { LogIn, Lock, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(credentials.username, credentials.password);
    
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message);
    }
  };

  const quickLogin = (role) => {
    const creds = role === 'admin' 
      ? { username: 'admin', password: 'admin123' }
      : { username: 'manager1', password: 'manager123' };
    
    setCredentials(creds);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Multi-store CRM</h1>
          <p>Multi-Store Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><User size={18} /> Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="form-control"
              placeholder="Enter username"
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

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-buttons">
            <button onClick={() => quickLogin('admin')} className="demo-btn">
              <strong>Super Admin</strong>
              <small>username: admin / password: admin123</small>
            </button>
            <button onClick={() => quickLogin('manager')} className="demo-btn">
              <strong>Store Manager</strong>
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




