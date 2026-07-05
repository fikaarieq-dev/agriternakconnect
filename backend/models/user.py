from config.database import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    __password = db.Column('password', db.String(255), nullable=False)
    role = db.Column(db.Enum('petani','peternak','pembeli','admin'), nullable=False)
    no_hp = db.Column(db.String(15))
    foto_profil = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.now)

    # Relasi
    petani = db.relationship('Petani', backref='user', uselist=False)
    orders = db.relationship('Order', backref='pembeli', lazy=True)

    def __init__(self, nama, email, password, role, no_hp=""):
        self.nama = nama
        self.email = email
        self.setPassword(password)
        self.role = role
        self.no_hp = no_hp

    # Encapsulation
    def setPassword(self, password):
        self.__password = generate_password_hash(password)

    def checkPassword(self, password):
        return check_password_hash(self.__password, password)

    def getProfil(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "email": self.email,
            "role": self.role,
            "no_hp": self.no_hp
        }

    def __str__(self):
        return f"[{self.role.upper()}] {self.nama}"