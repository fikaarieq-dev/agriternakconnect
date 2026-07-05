import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (parseInt(item.jumlah) || 0), 0);
      setCartCount(count);
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdate', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdate', updateCartCount);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* Fixed Top App Header */}
      <header className="app-header">
        <span className="header-brand">
          <i className="bi bi-seedling-fill"></i> AgriTernak
        </span>
        <span className="header-user">
          <i className="bi bi-person-circle"></i> {user.nama || 'Pengguna'}
        </span>
      </header>

      {/* Fixed Bottom Tab Navigation Bar */}
      <nav className="bottom-nav">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`} title="Beranda">
          <i className="bi bi-house-door-fill"></i>
          <span>Beranda</span>
        </Link>
        <Link to="/products" className={`nav-item ${isActive('/products')}`} title="Produk">
          <i className="bi bi-shop"></i>
          <span>Katalog</span>
        </Link>
        
        {user.role === 'pembeli' && (
          <Link to="/cart" className={`nav-item ${isActive('/cart')}`} title="Keranjang">
            <i className="bi bi-cart-fill"></i>
            <span>Keranjang</span>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </Link>
        )}

        <Link to="/orders" className={`nav-item ${isActive('/orders')}`} title="Pesanan">
          <i className="bi bi-receipt"></i>
          <span>Pesanan</span>
        </Link>

        <button onClick={logout} className="nav-item nav-logout" style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Keluar">
          <i className="bi bi-box-arrow-right"></i>
          <span>Keluar</span>
        </button>
      </nav>
    </>
  );
}

export default Navbar;