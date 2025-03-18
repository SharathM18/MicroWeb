from flask import Blueprint, request

from controller.addtocart_controller import AddToCartController

addtocart_controller = AddToCartController()
addtocart_bp = Blueprint("addtocart_route", __name__)


# sends productId and userId as a body
@addtocart_bp.route("/addtocart", methods=["POST"])
def addtocart_post():
    data = request.get_json()

    return addtocart_controller.addtocart_post(data)


# userId are required
@addtocart_bp.route("/addtocart/<user_id>", methods=["GET"])
def addtocart_get(user_id):
    return addtocart_controller.addtocart_get(user_id)


# cartId is required
@addtocart_bp.route("/addtocart/delete/<cart_id>", methods=["DELETE"])
def addtocart_delete(cart_id):
    return addtocart_controller.addtocart_delete(cart_id)


# cartId is required
@addtocart_bp.route("/cart/deleteall/<user_id>", methods=["DELETE"])
def cart_delete(user_id):
    return addtocart_controller.cart_delete(user_id)
