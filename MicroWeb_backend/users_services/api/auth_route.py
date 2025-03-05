from flask import Blueprint, request

from controller.auth_controller import AuthController

auth_controller = AuthController()
# Instead of defining all routes in a single file, Blueprints allow you to group related routes together
auth_bp = Blueprint("auth_route", "__main__")


# registration route/ signup route
@auth_bp.route("/auth/signup", methods=["POST"])
def signup():
    req_data = request.get_json()
    return auth_controller.signup_controller(req_data)


# login route
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    req_data = request.get_json()
    return auth_controller.login_controller(req_data)


# when the user refreshes the page, this route checks whether the token is valid or not.
@auth_bp.route("/auth/verify-token", methods=["GET"])
def verify_token():
    token = request.headers.get("x-auth_token")
    return auth_controller.verify_token_controller(token)
