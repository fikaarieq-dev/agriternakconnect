import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProducts, getOrders } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([getProducts(), getOrders()]);
        setStats({ products: prodRes.data.length, orders: ordRes.data.length });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div className="mobile-device">
      <Navbar />
      <div className="app-content">
        <div className="welcome-header">
          <h2 className="welcome-title">Selamat datang kembali, {user.nama}! 👋</h2>
          <p className="welcome-role">
            Peran Anda: <span className="role-badge">{user.role}</span>
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/products')}>
            <div className="stat-icon">
              <i className="bi bi-flower1"></i>
            </div>
            <h3 className="stat-num">{stats.products}</h3>
            <p className="stat-label">Total Produk</p>
          </div>
          <div className="stat-card" onClick={() => navigate('/orders')}>
            <div className="stat-icon">
              <i className="bi bi-receipt"></i>
            </div>
            <h3 className="stat-num">{stats.orders}</h3>
            <p className="stat-label">Total Pesanan</p>
          </div>
          {user.role === 'pembeli' && (
            <div className="stat-card stat-card-accent" style={{ gridColumn: 'span 2' }} onClick={() => navigate('/products')}>
              <div className="stat-icon">
                <i className="bi bi-cart-fill"></i>
              </div>
              <h3 className="stat-num" style={{ fontSize: '20px' }}>Belanja Sekarang</h3>
              <p className="stat-label">Cari Bahan Pangan Segar</p>
            </div>
          )}
          {(user.role === 'petani' || user.role === 'peternak') && (
            <div className="stat-card stat-card-accent" style={{ gridColumn: 'span 2' }} onClick={() => navigate('/products')}>
              <div className="stat-icon">
                <i className="bi bi-plus-circle-fill"></i>
              </div>
              <h3 className="stat-num" style={{ fontSize: '20px' }}>Jual Hasil Panen</h3>
              <p className="stat-label">Posting Hasil Tani/Ternak Baru</p>
            </div>
          )}
        </div>

        <div className="info-container">
          <div className="info-icon">
            <i className="bi bi-info-circle-fill" style={{ fontSize: '24px' }}></i>
          </div>
          <div className="info-details">
            <h3>Tentang Startup AgriTernak Connect</h3>
            <p>
              Platform marketplace inovatif yang menghubungkan produsen tani/ternak pedesaan langsung dengan konsumen perkotaan guna memangkas jalur distribusi tradisional dan menyejahterakan ekonomi pedesaan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;