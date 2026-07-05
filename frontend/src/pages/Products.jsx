import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getProducts, getCategories, createProduct } from '../services/api';

function Products() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    harga: '',
    stok: '',
    satuan: 'kg',
    category_id: '',
    deskripsi: ''
  });
  const [orderJumlah, setOrderJumlah] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProducts();
    getCategories()
      .then((r) => setCategories(r.data))
      .catch(console.error);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await createProduct(form);
      setMsg('✅ Produk berhasil diposting!');
      setShowForm(false);
      setForm({ nama: '', harga: '', stok: '', satuan: 'kg', category_id: '', deskripsi: '' });
      fetchProducts();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || err.response?.data?.msg || 'Gagal posting produk'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const qty = parseInt(orderJumlah[product.id] || 1);
    if (qty <= 0) {
      setMsg('❌ Jumlah barang harus minimal 1!');
      return;
    }
    if (qty > product.stok) {
      setMsg(`❌ Stok tidak mencukupi! Tersedia: ${product.stok} ${product.satuan}`);
      return;
    }

    try {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const newQty = cart[existingItemIndex].jumlah + qty;
        if (newQty > product.stok) {
          setMsg(`❌ Total barang di keranjang (${newQty}) melebihi stok tersedia (${product.stok})!`);
          return;
        }
        cart[existingItemIndex].jumlah = newQty;
      } else {
        cart.push({
          id: product.id,
          nama: product.nama,
          harga: product.harga,
          satuan: product.satuan,
          stok: product.stok,
          jumlah: qty,
          petani_id: product.petani_id
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdate'));
      setMsg(`✅ Berhasil menambahkan ${product.nama} x${qty} ke keranjang!`);
    } catch (err) {
      console.error(err);
      setMsg('❌ Gagal menambahkan barang ke keranjang.');
    }
  };

  const filteredProducts = activeCategory
    ? products.filter((p) => String(p.kategori) === String(activeCategory))
    : products;

  return (
    <div className="mobile-device">
      <Navbar />
      <div className="app-content">
        <div className="page-header">
          <h2 className="page-title">Catalog</h2>
          {(user.role === 'petani' || user.role === 'peternak') && (
            <button
              className={`btn-add-product ${showForm ? 'btn-cancel' : ''}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Batal' : (
                <>
                  <i className="bi bi-plus-lg"></i> Tambah
                </>
              )}
            </button>
          )}
        </div>

        {/* Mock Search Bar (Screenshot 1) */}
        <div className="search-bar-mock">
          <i className="bi bi-search"></i>
          <span>Search fresh food...</span>
        </div>

        {msg && (
          <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
            <i className={msg.startsWith('✅') ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'}></i>
            <span style={{ marginLeft: '6px' }}>{msg.substring(2)}</span>
          </div>
        )}

        {showForm && (
          <div className="form-card">
            <h3 className="form-card-title">Posting Produk Baru</h3>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nama Produk</label>
                  <input
                    className="form-input"
                    value={form.nama}
                    required
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="cth: Beras Organik"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select
                    className="form-input form-select"
                    value={form.category_id}
                    required
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Harga (Rp)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.harga}
                    required
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    placeholder="cth: 15000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stok Awal</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.stok}
                    required
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    placeholder="cth: 100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Satuan</label>
                  <select
                    className="form-input form-select"
                    value={form.satuan}
                    onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="ekor">ekor</option>
                    <option value="liter">liter</option>
                    <option value="ikat">ikat</option>
                    <option value="buah">buah</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Deskripsi</label>
                  <input
                    className="form-input"
                    value={form.deskripsi}
                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                    placeholder="Deskripsi singkat produk"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '12px' }} disabled={loading}>
                {loading ? 'Memposting...' : 'Posting Produk'}
              </button>
            </form>
          </div>
        )}

        {/* Black/White Pill tabs (Screenshot 1) */}
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`category-tab ${activeCategory === String(c.id) ? 'active' : ''}`}
              onClick={() => setActiveCategory(String(c.id))}
            >
              {c.nama}
            </button>
          ))}
        </div>

        {/* 2-Column Catalog Grid with Centered Cards (Screenshot 1) */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-search" style={{ fontSize: '32px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}></i>
              <h3 className="product-name">Katalog Kosong</h3>
              <p className="empty-text" style={{ fontSize: '11px' }}>Belum ada produk segar.</p>
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-img-wrapper">
                  {p.satuan === 'ekor' ? (
                    <i className="bi bi-egg-fill" style={{ color: '#d97706' }}></i>
                  ) : (
                    <i className="bi bi-flower1" style={{ color: '#2d6a4f' }}></i>
                  )}
                  <span className={`product-badge-status ${p.status}`}>
                    {p.status}
                  </span>
                </div>
                <div className="product-details">
                  <h4 className="product-name">{p.nama}</h4>
                  <div className="product-meta-row">
                    <span className="product-price">Rp {Number(p.harga).toLocaleString()}</span>
                    <span className="product-stock">Stok: {p.stok} {p.satuan}</span>
                  </div>

                  {user.role === 'pembeli' && p.status === 'tersedia' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max={p.stok}
                          value={orderJumlah[p.id] || 1}
                          onChange={(e) => setOrderJumlah({ ...orderJumlah, [p.id]: e.target.value })}
                          className="form-input"
                          style={{ width: '48px', padding: '4px', textAlign: 'center', fontSize: '11px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                        />
                      </div>
                      <button className="btn-card-action btn-add-cart" onClick={() => handleAddToCart(p)}>
                        <i className="bi bi-cart-fill"></i> + Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;