import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createOrder } from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [metodePembayaran, setMetodePembayaran] = useState('cod');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const items = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(items);
    } catch (e) {
      setCart([]);
    }
  };

  const handleQtyChange = (productId, delta) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const newQty = item.jumlah + delta;
        if (newQty <= 0) return item;
        if (newQty > item.stok) {
          alert(`Maksimal stok tersedia adalah ${item.stok} ${item.satuan}`);
          return item;
        }
        return { ...item, jumlah: newQty };
      }
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + Number(item.harga) * item.jumlah, 0);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      for (const item of cart) {
        await createOrder({
          product_id: item.id,
          jumlah: item.jumlah,
          metode_pembayaran: metodePembayaran,
          catatan: catatan
        });
      }

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdate'));
      alert('🎉 Pemesanan Berhasil! Silakan cek menu Pesanan.');
      navigate('/orders');
    } catch (err) {
      alert('❌ Gagal checkout: ' + (err.response?.data?.message || err.response?.data?.msg || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
      setShowCheckout(false);
    }
  };

  return (
    <div className="mobile-device">
      <Navbar />
      <div className="app-content">
        <div className="page-header">
          <h2 className="page-title">
            <i className="bi bi-cart3" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
            Keranjang Belanja
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-cart-x-fill" style={{ fontSize: '48px', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}></i>
            <h3 className="product-name">Keranjang Belanja Kosong</h3>
            <p className="empty-text" style={{ marginBottom: '20px' }}>
              Anda belum menambahkan produk apa pun ke keranjang.
            </p>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Cari Produk Sekarang
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-wrapper">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.satuan === 'ekor' ? (
                      <i className="bi bi-egg-fill" style={{ color: '#d97706' }}></i>
                    ) : (
                      <i className="bi bi-flower1" style={{ color: 'var(--primary)' }}></i>
                    )}
                  </div>
                  <div>
                    <h4 className="cart-item-name">{item.nama}</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Stok: {item.stok} {item.satuan}
                    </span>
                  </div>
                  <div style={{ justifySelf: 'end', textAlign: 'right' }}>
                    <div className="cart-item-price">
                      Rp {Number(item.harga).toLocaleString()}
                    </div>
                    <div className="qty-control" style={{ marginTop: '6px' }}>
                      <button className="qty-btn" onClick={() => handleQtyChange(item.id, -1)}>
                        -
                      </button>
                      <span className="qty-num">{item.jumlah}</span>
                      <button className="qty-btn" onClick={() => handleQtyChange(item.id, 1)}>
                        +
                      </button>
                      <button className="btn-delete-item" style={{ marginLeft: '6px' }} onClick={() => handleRemove(item.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-card">
              <h3 className="summary-title">Ringkasan Belanja</h3>
              <div className="summary-row">
                <span>Total Barang</span>
                <span>{cart.reduce((total, item) => total + item.jumlah, 0)} items</span>
              </div>
              <div className="summary-row total">
                <span>Total Tagihan</span>
                <span>Rp {calculateSubtotal().toLocaleString()}</span>
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => setShowCheckout(true)}
              >
                Lanjutkan Ke Pembayaran
              </button>
            </div>
          </div>
        )}

        {showCheckout && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setShowCheckout(false)}>
                ×
              </button>
              <h3 className="form-card-title" style={{ marginBottom: '12px' }}>
                Pilih Pembayaran
              </h3>
              <div className="summary-row" style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span>Subtotal Tagihan:</span>
                <strong style={{ color: 'var(--accent)', fontSize: '16px' }}>
                  Rp {calculateSubtotal().toLocaleString()}
                </strong>
              </div>

              <form onSubmit={handleCheckoutSubmit}>
                <div className="form-group">
                  <label className="form-label">Metode Pembayaran</label>

                  <div
                    className={`payment-method-card ${metodePembayaran === 'cod' ? 'active' : ''}`}
                    onClick={() => setMetodePembayaran('cod')}
                  >
                    <div className="payment-method-icon">
                      <i className="bi bi-cash-coin" style={{ color: '#16a34a' }}></i>
                    </div>
                    <div className="payment-method-name">COD (Bayar di Tempat)</div>
                  </div>

                  <div
                    className={`payment-method-card ${metodePembayaran === 'transfer' ? 'active' : ''}`}
                    onClick={() => setMetodePembayaran('transfer')}
                  >
                    <div className="payment-method-icon">
                      <i className="bi bi-bank" style={{ color: '#2563eb' }}></i>
                    </div>
                    <div className="payment-method-name">Transfer Bank (VA)</div>
                  </div>

                  <div
                    className={`payment-method-card ${metodePembayaran === 'qris' ? 'active' : ''}`}
                    onClick={() => setMetodePembayaran('qris')}
                  >
                    <div className="payment-method-icon">
                      <i className="bi bi-qr-code-scan" style={{ color: '#db2777' }}></i>
                    </div>
                    <div className="payment-method-name">QRIS (GoPay/OVO/Dana)</div>
                  </div>
                </div>

                {metodePembayaran === 'qris' && (
                  <div className="payment-sim-box">
                    <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      Scan QR Code berikut menggunakan E-Wallet Anda:
                    </p>
                    <div className="qris-code">
                      <img
                        src="/qris_payment_mockup.png"
                        alt="QRIS QR Code"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Total Pembayaran: Rp {calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                )}

                {metodePembayaran === 'transfer' && (
                  <div className="payment-sim-box">
                    <p style={{ fontSize: '12px', fontWeight: '600' }}>
                      Silakan transfer ke nomor Virtual Account Mandiri:
                    </p>
                    <div className="va-num">8873 0812 3456 7890</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Penerima: AgriTernak Connect Admin
                    </p>
                  </div>
                )}

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label className="form-label">Catatan Pesanan (Opsional)</label>
                  <input
                    className="form-input"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="cth: titip di pos satpam"
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '16px' }} disabled={loading}>
                  {loading ? 'Memproses Pesanan...' : 'Buat Pesanan Sekarang'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
