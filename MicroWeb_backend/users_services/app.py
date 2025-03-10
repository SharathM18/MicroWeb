from flask import Flask
from flask_cors import CORS

from api.address_routes import address_bp
from api.auth_route import auth_bp
from api.user_route import user_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(address_bp)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
