import datetime

from bson import ObjectId

from database.database import orders_collection, products_collection


class BuyModel:
    def __init__(self):
        pass

    def place_order(self, user_id, product_data):
        try:
            # Convert IDs to ObjectId
            product_data["sellerId"] = ObjectId(product_data["sellerId"])
            product_data["userId"] = ObjectId(product_data["userId"])
            product_data["product"][0]["productId"] = ObjectId(
                product_data["product"][0]["productId"]
            )
            product_data["shippingAddress"] = ObjectId(product_data["shippingAddress"])
            product_data["product"][0]["selectedQuantity"] = int(
                product_data["product"][0]["selectedQuantity"]
            )

            # Fetch product details from DB
            prod = products_collection.find_one(
                {"_id": product_data["product"][0]["productId"]}
            )

            if not prod:
                return {
                    "status": 404,
                    "message": "Product not found",
                    "error": "No product with provided productId",
                }

            available_stock = int(prod.get("stock", 0))

            if product_data["product"][0]["selectedQuantity"] > available_stock:
                return {
                    "status": 400,
                    "message": "Not enough stock available",
                    "error": "Stock too low for requested quantity",
                }

            # Update product stock
            update_stock = (
                available_stock - product_data["product"][0]["selectedQuantity"]
            )

            result_prod = products_collection.update_one(
                {"_id": prod["_id"]}, {"$set": {"stock": update_stock}}
            )

            if result_prod.matched_count == 0:
                return {
                    "status": 500,
                    "message": "Failed to update stock",
                    "error": "Product stock update failed",
                }

            # Set order placed date and save order
            product_data["orderPlacedDate"] = datetime.datetime.utcnow()

            orders_collection.insert_one(product_data)

            return {"status": 201, "message": "Order placed successfully"}

        except Exception as e:
            return {
                "status": 500,
                "message": "An error occurred while placing order",
                "error": str(e),
            }
