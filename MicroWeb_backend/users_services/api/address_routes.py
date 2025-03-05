from flask import Blueprint, request

from controller.address_controller import AddressController
from middleware.auth_middleware import token_required

address_controller = AddressController()
address_bp = Blueprint("address_route", __name__)


@address_bp.route("/profile/address/add", methods=["POST"])
@token_required
def add_address():
    req_data = request.get_json()
    return address_controller.add_address(req_data)


@address_bp.route("/profile/address/<user_id>", methods=["GET"])
@token_required
def get_address(user_id):
    return address_controller.get_address(user_id)


@address_bp.route("/profile/address/update/<address_id>", methods=["PUT"])
@token_required
def update_address(address_id):
    req_data = request.get_json()
    return address_controller.update_address(address_id, req_data)


@address_bp.route("/profile/address/delete/<user_id>/<address_id>", methods=["DELETE"])
@token_required
def delete_address(user_id, address_id):
    return address_controller.delete_address(user_id, address_id)
