from flask import Blueprint

from controller.order_controller import OrderModel

order_controller = OrderModel()
order_bp = Blueprint("order_route", __name__)


@order_bp.route("/order/<user_id>", methods=["GET"])
def order(user_id):
    return order_controller.order(user_id)
