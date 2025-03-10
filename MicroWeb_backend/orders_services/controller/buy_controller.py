from flask import jsonify

from model.buy_model import BuyModel


class BuyController:
    def __init__(self):
        self.buy_model = BuyModel()

    def buy_controller(self, user_id, product_data):
        try:
            seller_id = product_data["data"].get("sellerId")
            user_id = product_data["data"].get("userId")
            address = product_data["data"].get("shippingAddress")
            product_info = product_data["data"].get("product", {})
            product_id = product_info.get("productId")
            quantity = int(product_info.get("selectedQuantity", 0))

            price = float(product_info.get("totalPrice", 0))

            if not all([seller_id, user_id, product_id]):
                return jsonify(
                    {
                        "status": "fail",
                        "message": "Missing required data",
                        "error": "Missing sellerId, userId, or productId",
                    }
                ), 400

            if not address:
                return jsonify(
                    {
                        "status": "fail",
                        "message": "Please select an address",
                        "error": "Address is required",
                    }
                ), 400

            if quantity <= 0:
                return jsonify(
                    {
                        "status": "fail",
                        "message": "Invalid quantity",
                        "error": "Quantity must be greater than zero",
                    }
                ), 400

            if price <= 0:
                return jsonify(
                    {
                        "status": "fail",
                        "message": "Invalid price",
                        "error": "Price must be greater than zero",
                    }
                ), 400

            order_prod_data = {
                "product": [
                    {
                        "productId": product_id,
                        "selectedQuantity": quantity,
                        "totalPrice": price,
                    }
                ],
                "sellerId": seller_id,
                "userId": user_id,
                "shippingAddress": address,
            }

            db_response = self.buy_model.place_order(user_id, order_prod_data)

            return jsonify(db_response), db_response.get("status", 200)

        except Exception as e:
            return jsonify(
                {
                    "status": "fail",
                    "message": "Unexpected error occurred",
                    "error": str(e),
                }
            ), 500
