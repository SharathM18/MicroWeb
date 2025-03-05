from api.category_route import category_bp
from api.products_route import products_bp
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(category_bp)
app.register_blueprint(products_bp)

if __name__ == "__main__":
    app.run(port=5001, debug=True)
