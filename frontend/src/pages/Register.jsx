import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'pembeli',
    no_hp: '',
    lokasi: '',
    jenis_ternak: '',
    deskripsi: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.msg || 'Registrasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-device">
      <div className="auth-device-content" style={{ justifyContent: 'flex-start', overflowY: 'auto', padding: '40px 24px' }}>
        <div className="auth-device-card" style={{ marginTop: '10px' }}>
          <h2 className="auth-device-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <i className="bi bi-seedling-fill" style={{ color: 'var(--primary)' }}></i>
            Create Account
          </h2>
          <h3 className="auth-device-subtitle">Buat akun baru Anda</h3>
          
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Nama Lengkap</label>
              <input name="nama" value={form.nama} onChange={handleChange}
                className="form-input-line" placeholder="Nama lengkap" required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} className="form-input-line"
                placeholder="email@contoh.com" required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} className="form-input-line"
                placeholder="Minimal 6 karakter" required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>Daftar Sebagai</label>
              <select name="role" value={form.role} onChange={handleChange} className="form-input-line form-select" style={{ border: 'none', borderBottom: '1.5px solid #cbd5e1' }}>
                <option value="pembeli">Pembeli (Konsumen)</option>
                <option value="petani">Petani</option>
                <option value="peternak">Peternak</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-muted)' }}>No. HP</label>
              <input name="no_hp" value={form.no_hp} onChange={handleChange}
                className="form-input-line" placeholder="08xxxxxxxxxx" />
            </div>
            {(form.role === 'petani' || form.role === 'peternak') && (
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Lokasi</label>
                <input name="lokasi" value={form.lokasi} onChange={handleChange}
                  className="form-input-line" placeholder="Kab/Kota, Provinsi" required />
              </div>
            )}
            {form.role === 'peternak' && (
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Jenis Ternak</label>
                <select name="jenis_ternak" value={form.jenis_ternak}
                  onChange={handleChange} className="form-input-line form-select" required style={{ border: 'none', borderBottom: '1.5px solid #cbd5e1' }}>
                  <option value="">Pilih jenis ternak</option>
                  <option value="ayam">Ayam</option>
                  <option value="ikan">Ikan</option>
                  <option value="sapi">Sapi</option>
                  <option value="kambing">Kambing</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn-gold" disabled={loading} style={{ marginTop: '24px' }}>
              {loading ? 'Memproses Pendaftaran...' : 'Sign up'}
            </button>
          </form>
          <p className="auth-link" style={{ fontSize: '12px', marginTop: '16px' }}>
            Sudah punya akun? <Link to="/login">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;