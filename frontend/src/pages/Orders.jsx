import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getOrders, updateOrderStatus, updatePaymentStatus } from '../services/api';

function Orders() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setMsg(`✅ Status pesanan #${id} diupdate ke "${status}"`);
      fetchOrders();
    } catch (err) {
      setMsg('❌ Gagal update status pesanan.');
    }
  };

  const handlePay = async (id) => {
    try {
      await updatePaymentStatus(id, 'lunas');
      setMsg(`✅ Pesanan #${id} berhasil dibayar!`);
      setActivePaymentOrder(null);
      fetchOrders();
    } catch (err) {
      setMsg('❌ Gagal memproses pembayaran.');
    }
  };

  const statusColor = {
    pending: 'pending',
    dikonfirmasi: 'dikonfirmasi',
    dikirim: 'dikirim',
    selesai: 'selesai',
    dibatalkan: 'dibatalkan'
  };

  return (
    <div className="mobile-device">
      <Navbar />
      <div className="app-content">
        <div className="page-header">
          <h2 className="page-title">
            <i className="bi bi-receipt" style={{ color: 'var(--primary)', marginRight: '6px' }}></i>
            Daftar Pesanan
          </h2>
        </div>

        {msg && (
          <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
            <i className={msg.startsWith('✅') ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'}></i>
            <span style={{ marginLeft: '6px' }}>{msg.substring(2)}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-file-earmark-x" style={{ fontSize: '40px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}></i>
            <h3 className="product-name">Belum Ada Pesanan</h3>
            <p className="empty-text">Anda tidak memiliki transaksi pemesanan saat ini.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((o) => (
              <div key={o.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-card-id">#{o.id}</span>
                    <span className="order-card-date" style={{ marginLeft: '8px' }}>
                      <i className="bi bi-calendar3" style={{ marginRight: '3px' }}></i> {o.order_date.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className={`order-status-badge ${statusColor[o.status] || ''}`}>
                      {o.status}
                    </span>
                    <span
                      className={`payment-status-badge ${o.status_pembayaran}`}
                      style={{ marginLeft: '6px' }}
                    >
                      {o.status_pembayaran === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="cart-item-img">
                    <i className="bi bi-box-seam" style={{ color: 'var(--primary)' }}></i>
                  </div>
                  <div>
                    <h4 className="product-name" style={{ fontSize: '14px', marginBottom: '2px' }}>
                      {o.product_nama}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Bayar: <strong style={{ textTransform: 'uppercase' }}>{o.metode_pembayaran}</strong>
                    </span>
                  </div>
                  <div style={{ justifySelf: 'end', textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      Qty: <strong>{o.jumlah}</strong>
                    </div>
                    <div className="cart-item-price">
                      Rp {Number(o.total).toLocaleString()}
                    </div>
                  </div>
                </div>

                {o.catatan && (
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #edf2f7' }}>
                    <i className="bi bi-sticky" style={{ marginRight: '4px' }}></i> <strong>Catatan:</strong> {o.catatan}
                  </div>
                )}

                {/* Actions Row */}
                <div className="order-actions">
                  {/* Buyer actions */}
                  {user.role === 'pembeli' && o.status_pembayaran === 'belum_bayar' && o.metode_pembayaran !== 'cod' && (
                    <button
                      className="btn-action-small primary"
                      onClick={() => setActivePaymentOrder(o)}
                    >
                      <i className="bi bi-credit-card"></i> Bayar Sekarang
                    </button>
                  )}

                  {/* Seller actions */}
                  {(user.role === 'petani' || user.role === 'peternak') && (
                    <>
                      {o.status_pembayaran === 'belum_bayar' && (
                        <button
                          className="btn-action-small success"
                          onClick={() => handlePay(o.id)}
                        >
                          <i className="bi bi-check-lg"></i> Set Lunas
                        </button>
                      )}
                      {o.status === 'pending' && (
                        <button
                          className="btn-action-small primary"
                          onClick={() => handleStatus(o.id, 'dikonfirmasi')}
                        >
                          Konfirmasi
                        </button>
                      )}
                      {o.status === 'dikonfirmasi' && (
                        <button
                          className="btn-action-small primary"
                          onClick={() => handleStatus(o.id, 'dikirim')}
                        >
                          Kirim Barang
                        </button>
                      )}
                      {o.status === 'dikirim' && (
                        <button
                          className="btn-action-small primary"
                          onClick={() => handleStatus(o.id, 'selesai')}
                        >
                          Selesai
                        </button>
                      )}
                      {o.status === 'pending' && (
                        <button
                          className="btn-action-small danger"
                          onClick={() => handleStatus(o.id, 'dibatalkan')}
                        >
                          Batalkan
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Simulator Modal */}
        {activePaymentOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setActivePaymentOrder(null)}>
                ×
              </button>
              <h3 className="form-card-title" style={{ marginBottom: '12px' }}>
                Simulasi Pembayaran #{activePaymentOrder.id}
              </h3>
              <div className="summary-row" style={{ marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span>Total Belanja:</span>
                <strong style={{ color: 'var(--accent)', fontSize: '15px' }}>
                  Rp {Number(activePaymentOrder.total).toLocaleString()}
                </strong>
              </div>

              {activePaymentOrder.metode_pembayaran === 'qris' && (
                <div className="payment-sim-box">
                  <p style={{ fontSize: '12px', fontWeight: '600' }}>
                    Scan QRIS berikut untuk membayar:
                  </p>
                  <div className="qris-code">
                    <img
                      src="/qris_payment_mockup.png"
                      alt="QRIS QR Code"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              )}

              {activePaymentOrder.metode_pembayaran === 'transfer' && (
                <div className="payment-sim-box">
                  <p style={{ fontSize: '12px', fontWeight: '600' }}>
                    Silakan transfer ke Virtual Account Bank Mandiri:
                  </p>
                  <div className="va-num">8873 0812 3456 7890</div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Penerima: AgriTernak Connect Admin
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button
                  className="btn-primary"
                  onClick={() => handlePay(activePaymentOrder.id)}
                >
                  Saya Sudah Bayar
                </button>
                <button
                  className="btn-primary btn-cancel"
                  style={{ background: '#64748b' }}
                  onClick={() => setActivePaymentOrder(null)}
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;