from config.database import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    pembeli_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    jumlah = db.Column(db.Integer, nullable=False, default=1)
    __total = db.Column('total', db.Numeric(12,2), nullable=False)
    status = db.Column(db.Enum('pending','dikonfirmasi','dikirim','selesai','dibatalkan'), default='pending')
    metode_pembayaran = db.Column(db.Enum('cod','transfer','qris'), nullable=False, default='cod')
    status_pembayaran = db.Column(db.Enum('belum_bayar','lunas'), nullable=False, default='belum_bayar')
    catatan = db.Column(db.Text)
    order_date = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def __init__(self, pembeli_id, product_id, jumlah, harga_satuan, metode_pembayaran='cod', catatan=""):
        self.pembeli_id = pembeli_id
        self.product_id = product_id
        self.jumlah = jumlah
        self.__total = harga_satuan * jumlah
        self.metode_pembayaran = metode_pembayaran
        self.catatan = catatan

    # Encapsulation
    def getTotal(self):
        return float(self.__total)

    def hitungTotal(self, harga_satuan):
        self.__total = harga_satuan * self.jumlah

    def konfirmasi(self):
        self.status = 'dikonfirmasi'

    def kirim(self):
        self.status = 'dikirim'

    def selesai(self):
        self.status = 'selesai'

    def batalkan(self):
        self.status = 'dibatalkan'

    def toDict(self):
        return {
            "id": self.id,
            "pembeli_id": self.pembeli_id,
            "product_id": self.product_id,
            "product_nama": self.produk.nama if self.produk else f"Produk #{self.product_id}",
            "jumlah": self.jumlah,
            "total": self.getTotal(),
            "status": self.status,
            "metode_pembayaran": self.metode_pembayaran,
            "status_pembayaran": self.status_pembayaran,
            "catatan": self.catatan,
            "order_date": self.order_date.strftime("%d-%m-%Y %H:%M")
        }