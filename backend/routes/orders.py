from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.database import db
from models.user import User
from models.product import Product
from models.order import Order

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'pembeli':
        return jsonify({"message": "Hanya pembeli yang bisa memesan!"}), 403

    data = request.get_json()
    product = Product.query.get_or_404(data['product_id'])

    if product.getStok() < data['jumlah']:
        return jsonify({"message": f"Stok tidak cukup! Tersedia: {product.getStok()}"}), 400

    order = Order(
        pembeli_id=user_id,
        product_id=product.id,
        jumlah=data['jumlah'],
        harga_satuan=product.getHarga(),
        metode_pembayaran=data.get('metode_pembayaran', 'cod'),
        catatan=data.get('catatan', '')
    )
    product.updateStok(product.getStok() - data['jumlah'])
    db.session.add(order)
    db.session.commit()
    return jsonify({"message": "Pesanan berhasil dibuat!", "order": order.toDict()}), 201


@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'pembeli':
        orders = Order.query.filter_by(pembeli_id=user_id).all()
    elif user.role in ['petani', 'peternak']:
        from models.product import Petani
        petani = Petani.query.filter_by(user_id=user_id).first()
        product_ids = [p.id for p in petani.products]
        orders = Order.query.filter(Order.product_id.in_(product_ids)).all()
    else:
        orders = Order.query.all()

    return jsonify([o.toDict() for o in orders]), 200


@orders_bp.route('/<int:id>/status', methods=['PUT'])
@jwt_required()
def update_status(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()
    status = data.get('status')

    if status == 'dikonfirmasi':
        order.konfirmasi()
    elif status == 'dikirim':
        order.kirim()
    elif status == 'selesai':
        order.selesai()
    elif status == 'dibatalkan':
        product = Product.query.get(order.product_id)
        product.updateStok(product.getStok() + order.jumlah)
        order.batalkan()
    else:
        return jsonify({"message": "Status tidak valid!"}), 400

    db.session.commit()
    return jsonify({"message": f"Status diupdate ke {status}!", "order": order.toDict()}), 200


@orders_bp.route('/<int:id>/payment-status', methods=['PUT'])
@jwt_required()
def update_payment_status(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()
    status_pembayaran = data.get('status_pembayaran')

    if status_pembayaran not in ['belum_bayar', 'lunas']:
        return jsonify({"message": "Status pembayaran tidak valid!"}), 400

    order.status_pembayaran = status_pembayaran
    db.session.commit()
    return jsonify({"message": f"Status pembayaran diupdate ke {status_pembayaran}!", "order": order.toDict()}), 200