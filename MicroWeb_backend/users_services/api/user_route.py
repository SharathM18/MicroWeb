from flask import Blueprint, request

from controller.user_controller import UserController
from middleware.auth_middleware import token_required

user_controller = UserController()
user_bp = Blueprint("user_route", __name__)


@user_bp.route("/profile/<user_id>", methods=["GET"])
@token_required
def profile_data(user_id):
    return user_controller.profile_data(user_id)
