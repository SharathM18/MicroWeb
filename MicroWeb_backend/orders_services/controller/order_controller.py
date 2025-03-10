from flask import jsonify

from model.order_model import OrderModel


class OrderController:
    def __init__(self):
        self.order_model = OrderModel()

    def order(self, user_id):
        db_response = self.order_model.order(user_id)

        if db_response.get("status") == 500:
            return jsonify(db_response), 500

        return jsonify(db_response), 200
