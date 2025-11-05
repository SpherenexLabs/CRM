import { useState } from 'react';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import './CustomerRegister.css';

function CustomerRegister({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { registerCustomer } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await registerCustomer(formData);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="customer-register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Register as a customer</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label><User size={18} /> Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label><Mail size={18} /> Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label><Phone size={18} /> Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="form-control"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label><Lock size={18} /> Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="form-control"
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label><Lock size={18} /> Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="form-control"
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn-register">
            <UserPlus size={20} />
            Register
          </button>
        </form>

        <div className="switch-auth">
          <p>Already have an account?</p>
          <button onClick={onSwitchToLogin} className="link-button">
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;
