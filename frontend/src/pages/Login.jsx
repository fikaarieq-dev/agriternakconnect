import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || 'Login gagal!');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = (provider) => {
    alert(`🔑 Simulasi Login dengan ${provider} berhasil!`);
    // Mock user login as buyer
    const mockUser = {
      id: 99,
      nama: 'Budi Santoso (Google)',
      email: 'budisantoso@gmail.com',
      role: 'pembeli',
      no_hp: '081234567890'
    };
    localStorage.setItem('token', 'mock_jwt_token_social_login');
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate('/dashboard');
  };

  return (
    <div className="mobile-device">
      <div className="auth-device-content">
        <div className="auth-device-card">
          <h2 className="auth-device-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <i className="bi bi-seedling-fill" style={{ color: 'var(--primary)' }}></i>
            Log in
          </h2>
          <h3 className="auth-device-subtitle">Selamat datang di AgriTernak</h3>
          
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} className="form-input-line"
                placeholder="email@contoh.com" required />
            </div>
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} className="form-input-line"
                placeholder="Password" required />
            </div>
            <button type="submit" className="btn-gold" disabled={loading}>
              {loading ? 'Memproses Masuk...' : 'Log in'}
            </button>
          </form>

          {/* Social Logins Simulation (Screenshot 2) */}
          <div className="social-login-box">
            <button type="button" className="btn-social google" onClick={() => handleSocialMock('Google')}>
              <i className="bi bi-google"></i> Log in with Google
            </button>
            <button type="button" className="btn-social facebook" onClick={() => handleSocialMock('Facebook')}>
              <i className="bi bi-facebook"></i> Log in with Facebook
            </button>
          </div>

          <p className="auth-link" style={{ fontSize: '12px', marginTop: '16px' }}>
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;