from flask import Flask
from flask_cors import CORS

from api.buy_route import buy_bp
from api.orders_route import order_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(buy_bp)
app.register_blueprint(order_bp)

if __name__ == "__main__":
    app.run(port=5002, debug=True)
