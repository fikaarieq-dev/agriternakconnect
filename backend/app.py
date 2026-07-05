from flask import Flask
from flask_cors import CORS
from config.database import db, jwt, init_app
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')

    with app.app_context():
        db.create_all()
        
        # Automatic DB schema migration for orders table new payment columns
        try:
            db.session.execute(db.text("ALTER TABLE orders ADD COLUMN metode_pembayaran ENUM('cod', 'transfer', 'qris') NOT NULL DEFAULT 'cod'"))
            db.session.commit()
            print("Migration: Added 'metode_pembayaran' column to 'orders' table.")
        except Exception:
            db.session.rollback()

        try:
            db.session.execute(db.text("ALTER TABLE orders ADD COLUMN status_pembayaran ENUM('belum_bayar', 'lunas') NOT NULL DEFAULT 'belum_bayar'"))
            db.session.commit()
            print("Migration: Added 'status_pembayaran' column to 'orders' table.")
        except Exception:
            db.session.rollback()

        print("Database tables created & migrated!")

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)