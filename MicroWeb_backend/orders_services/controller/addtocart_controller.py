from model.addtocart_model import AddToCartModel


class AddToCartController:
    def __init__(self):
        self.addtocart_model = AddToCartModel()

    def addtocart_post(self, data):
        if not data.get("userId"):
            return {"status": 400, "message": "User ID is required"}, 400

        if not data.get("productId"):
            return {"status": 400, "message": "Product ID is required"}, 400

        db_response = self.addtocart_model.addtocart_post(data)

        if db_response.get("status") == 201:
            return db_response, 201

        if db_response.get("status") == 400:
            return db_response, 400

        return db_response, 500

    def addtocart_get(self, user_id):
        if not user_id:
            return {"status": 400, "message": "User ID is required"}, 400

        db_response = self.addtocart_model.addtocart_get(user_id)

        if db_response.get("status") == 200:
            return db_response, 200

        return db_response, 500

    def addtocart_delete(self, cart_id):
        if not cart_id:
            return {"status": 400, "message": "Cart ID is required"}, 400

        db_response = self.addtocart_model.addtocart_delete(cart_id)

        if db_response.get("status") == 200:
            return db_response, 200

        return db_response, 500

    def cart_delete(self, user_id):
        if not user_id:
            return {"status": 400, "message": "User ID is required"}, 400

        db_response = self.addtocart_model.cart_delete(user_id)

        if db_response.get("status") == 200:
            return db_response, 200

        return db_response, 500
