from flask import Blueprint, request

from controller.buy_controller import BuyController

buy_conreoller = BuyController()
buy_bp = Blueprint("buy_route", __name__)


@buy_bp.route("/order/buy/<user_id>", methods=["POST"])
def buy(user_id):
    req_data = request.get_json()
    print(req_data)
    return buy_conreoller.buy_controller(user_id, req_data)
