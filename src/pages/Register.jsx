import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { useToast } from '../context/ToastContext';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard', { replace: true });
  }, [navigate]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await registerUser(formData); // Send FormData
      
      if (res.data.isSuccess) {
        toast.success('Account created! Please login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon"><span className="material-icons">person_add</span></div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us today</p>
        
        {/* Profile Image Upload */}
        <div className="image-upload-container">
          <div className="image-preview-wrapper">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">
                <span className="material-icons">add_photo_alternate</span>
              </div>
            )}
          </div>
          <label className="image-upload-label">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }}
            />
            <span className="material-icons">camera_alt</span>
            Upload Photo
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><span className="material-icons">badge</span> Username</label>
            <input type="text" placeholder="Choose a username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label><span className="material-icons">email</span> Email</label>
            <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label><span className="material-icons">lock</span> Password</label>
            <input type="password" placeholder="Create a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            <span className="material-icons">person_add</span> 
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}

export default Register;