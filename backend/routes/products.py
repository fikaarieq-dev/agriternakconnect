from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import db
from models.user import User
from models.product import Product, Petani, Category

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    kategori = request.args.get('kategori')
    query = Product.query.filter_by(status='tersedia')
    if kategori:
        query = query.filter_by(category_id=kategori)
    products = query.all()
    return jsonify([p.toDict() for p in products]), 200


@products_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.toDict()), 200


@products_bp.route('/', methods=['POST'])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role not in ['petani', 'peternak']:
        return jsonify({"message": "Hanya petani/peternak yang bisa posting produk!"}), 403

    petani = Petani.query.filter_by(user_id=user_id).first()
    if not petani:
        return jsonify({"message": "Data petani tidak ditemukan!"}), 404

    data = request.get_json()
    product = Product(
        petani_id=petani.id,
        category_id=data['category_id'],
        nama=data['nama'],
        harga=data['harga'],
        stok=data['stok'],
        satuan=data.get('satuan', 'kg'),
        deskripsi=data.get('deskripsi', '')
    )
    petani.postingProduk(product)
    db.session.add(product)
    db.session.commit()
    return jsonify({"message": "Produk berhasil diposting!", "product": product.toDict()}), 201


@products_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    user_id = get_jwt_identity()
    product = Product.query.get_or_404(id)
    petani = Petani.query.filter_by(user_id=user_id).first()

    if not petani or product.petani_id != petani.id:
        return jsonify({"message": "Akses ditolak!"}), 403

    data = request.get_json()
    if 'harga' in data:
        product.updateHarga(data['harga'])
    if 'stok' in data:
        product.updateStok(data['stok'])
    if 'nama' in data:
        product.nama = data['nama']
    if 'deskripsi' in data:
        product.deskripsi = data['deskripsi']

    db.session.commit()
    return jsonify({"message": "Produk berhasil diupdate!", "product": product.toDict()}), 200


@products_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    user_id = get_jwt_identity()
    product = Product.query.get_or_404(id)
    petani = Petani.query.filter_by(user_id=user_id).first()

    if not petani or product.petani_id != petani.id:
        return jsonify({"message": "Akses ditolak!"}), 403

    product.hapusProduk()
    db.session.commit()
    return jsonify({"message": "Produk berhasil dihapus!"}), 200


@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.toDict() for c in categories]), 200