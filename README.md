# AgriTernak Connect

AgriTernak Connect adalah platform digital/marketplace khusus yang bertujuan untuk menghubungkan para petani dan peternak lokal secara langsung dengan pembeli (konsumen akhir maupun pelaku bisnis/B2B). Platform ini dirancang untuk memotong rantai distribusi yang panjang, meningkatkan pendapatan petani/peternak, serta memberikan kepastian kualitas dan ketersediaan stok bagi pembeli.

---

## Fitur Utama (MVP Target)
1. **Autentikasi & Multi-role User**: Registrasi dan Login terenkripsi untuk Petani, Peternak, Pembeli, dan Admin.
2. **Manajemen Produk (E-commerce)**:
   - Petani/peternak dapat memposting produk hasil tani/ternak mereka (dilengkapi dengan harga, stok, foto, dan kategori).
   - Pembeli dapat melihat katalog produk terupdate.
3. **Sistem Pemesanan (Order)**:
   - Pembeli dapat melakukan transaksi pembelian produk dengan jumlah tertentu.
   - Petani/peternak dapat menerima notifikasi pesanan dan memperbarui status pesanan (pending, dikonfirmasi, dikirim, selesai, dibatalkan).
   - Stok produk otomatis berkurang setelah pesanan berhasil dibuat.

---

## Struktur Folder
```text
agriternakconnect/
├── backend/               # Flask RESTful API (Backend)
│   ├── config/            # Konfigurasi Database & JWT
│   ├── models/            # Struktur Model Database (OOP)
│   ├── routes/            # Endpoint API Blueprint
│   ├── app.py             # Entrypoint Aplikasi Backend
│   └── .env               # Environment Variable (Kredensial DB & JWT)
├── frontend/              # React App (Frontend)
│   ├── public/            # Aset Statis
│   ├── src/               # Komponen & Logika React
│   └── package.json       # Dependensi NPM
├── docs/                  # Dokumentasi Perencanaan Tugas
└── .gitignore             # File Git Ignore Root
```

---

## Cara Menjalankan Aplikasi

### 1. Prasyarat (Prerequisites)
Pastikan Anda memiliki tools berikut terinstal di komputer Anda:
- **Python 3.x**
- **Node.js & npm**
- **MySQL Database Server**

### 2. Konfigurasi Backend (Flask)
1. Buka terminal di direktori `backend/`.
2. Buat dan aktifkan virtual environment Python:
   ```bash
   python -m venv venv
   # Di Windows (Command Prompt):
   venv\Scripts\activate
   # Di Windows (PowerShell):
   .\venv\Scripts\Projectactivate.ps1
   # Di macOS/Linux:
   source venv/bin/activate
   ```
3. Instal dependensi backend:
   ```bash
   pip install flask flask-sqlalchemy flask-cors flask-jwt-extended pymysql python-dotenv werkzeug
   ```
4. Salin file `.env` di dalam folder `backend/` dan sesuaikan konfigurasinya dengan database MySQL lokal Anda:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=agriternak_db
   DB_USER=root
   DB_PASSWORD=yourpassword
   JWT_SECRET_KEY=your_jwt_secret_key
   ```
5. Buat database di MySQL Anda dengan nama `agriternak_db`.
6. Jalankan server Flask:
   ```bash
   python app.py
   ```
   Server backend akan berjalan di `http://127.0.0.1:5000`. Saat dijalankan pertama kali, tabel database akan otomatis terbuat.

### 3. Konfigurasi Frontend (React)
1. Buka terminal baru di direktori `frontend/`.
2. Instal dependensi frontend:
   ```bash
   npm install
   ```
3. Jalankan aplikasi React:
   ```bash
   npm start
   ```
   Aplikasi frontend akan terbuka di browser Anda secara otomatis pada alamat `http://localhost:3000`.

---


