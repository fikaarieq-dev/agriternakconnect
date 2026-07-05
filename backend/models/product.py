from config.database import db
from datetime import datetime

class Petani(db.Model):
    __tablename__ = 'petani'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lokasi = db.Column(db.String(255), nullable=False)
    jenis = db.Column(db.Enum('petani','peternak'), nullable=False)
    jenis_ternak = db.Column(db.Enum('ayam','ikan','sapi','kambing','lainnya'))
    deskripsi = db.Column(db.Text)
    jadwal_panen = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.now)

    products = db.relationship('Product', backref='penjual', lazy=True)

    def postingProduk(self, product):
        self.products.append(product)
        return f"Produk '{product.nama}' berhasil diposting"

    def updateStokTernak(self, product, stok_baru):
        stok_lama = product.getStok()
        product.updateStok(stok_baru)
        return f"Stok diupdate: {stok_lama} → {stok_baru}"

    def toDict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "lokasi": self.lokasi,
            "jenis": self.jenis,
            "jenis_ternak": self.jenis_ternak,
            "deskripsi": self.deskripsi
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    petani_id = db.Column(db.Integer, db.ForeignKey('petani.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    nama = db.Column(db.String(150), nullable=False)
    deskripsi = db.Column(db.Text)
    __harga = db.Column('harga', db.Numeric(12,2), nullable=False)
    __stok = db.Column('stok', db.Integer, default=0)
    satuan = db.Column(db.String(20), default='kg')
    foto = db.Column(db.String(255))
    status = db.Column(db.Enum('tersedia','habis','nonaktif'), default='tersedia')
    created_at = db.Column(db.DateTime, default=datetime.now)

    orders = db.relationship('Order', backref='produk', lazy=True)

    def __init__(self, petani_id, category_id, nama, harga, stok, satuan='kg', deskripsi=''):
        self.petani_id = petani_id
        self.category_id = category_id
        self.nama = nama
        self.__harga = harga
        self.__stok = stok
        self.satuan = satuan
        self.deskripsi = deskripsi

    # Encapsulation
    def getHarga(self):
        return float(self.__harga)

    def getStok(self):
        return self.__stok

    def updateStok(self, jumlah_baru):
        self.__stok = jumlah_baru
        if self.__stok == 0:
            self.status = 'habis'

    def updateHarga(self, harga_baru):
        self.__harga = harga_baru

    def hapusProduk(self):
        self.status = 'nonaktif'

    def toDict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "harga": self.getHarga(),
            "stok": self.getStok(),
            "satuan": self.satuan,
            "kategori": self.category_id,
            "status": self.status,
            "foto": self.foto
        }


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    tipe = db.Column(db.Enum('hasil_tani','hasil_ternak'), nullable=False)

    products = db.relationship('Product', backref='category', lazy=True)

    def toDict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "tipe": self.tipe
        }