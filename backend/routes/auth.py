from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config.database import db
from models.user import User
from models.product import Petani

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Cek email sudah ada
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email sudah terdaftar!"}), 400

    # Buat user baru
    user = User(
        nama=data['nama'],
        email=data['email'],
        password=data['password'],
        role=data['role'],
        no_hp=data.get('no_hp', '')
    )
    db.session.add(user)
    db.session.flush()

    # Kalau petani/peternak, tambah data petani
    if data['role'] in ['petani', 'peternak']:
        petani = Petani(
            user_id=user.id,
            lokasi=data.get('lokasi', ''),
            jenis=data['role'],
            jenis_ternak=data.get('jenis_ternak', None),
            deskripsi=data.get('deskripsi', '')
        )
        db.session.add(petani)

    db.session.commit()
    return jsonify({"message": "Registrasi berhasil!", "user": user.getProfil()}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.checkPassword(data['password']):
        return jsonify({"message": "Email atau password salah!"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login berhasil!",
        "token": token,
        "user": user.getProfil()
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User tidak ditemukan!"}), 404
    return jsonify(user.getProfil()), 200