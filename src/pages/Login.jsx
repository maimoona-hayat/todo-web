import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useToast } from '../context/ToastContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { error, success } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      if (res.data.isSuccess && res.data.data) {
        localStorage.setItem('token', res.data.data.token);
        const { password, ...userWithoutPassword } = res.data.data.user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        success('Welcome back!');
        navigate('/dashboard', { replace: true });
      } else {
        error(res.data.message || 'Login failed');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon"><span className="material-icons">task_alt</span></div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><span className="material-icons">email</span> Email</label>
            <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label><span className="material-icons">lock</span> Password</label>
            <input type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary"><span className="material-icons">login</span> Sign In</button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></p>
      </div>
    </div>
  );
}

export default Login;