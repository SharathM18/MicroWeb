from bson import ObjectId

from database.database import cart_collection, products_collection


class AddToCartModel:
    def __init__(self):
        pass

    def addtocart_post(self, data):
        try:
            cart_prod = cart_collection.find_one(
                {
                    "userId": ObjectId(data["userId"]),
                    "productId": ObjectId(data["productId"]),
                }
            )

            if cart_prod:
                return {"status": 400, "message": "Product already in cart"}

            data["userId"] = ObjectId(data["userId"])
            data["productId"] = ObjectId(data["productId"])

            cart_collection.insert_one(data)

            cart_count = list(cart_collection.find({}))

            return {
                "status": 201,
                "message": "Product added to cart successfully",
                "cartCount": len(cart_count),
            }

        except Exception as e:
            return {
                "status": 500,
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def addtocart_delete(self, cart_id):
        try:
            cart_collection.delete_one({"_id": ObjectId(cart_id)})

            return {"status": 200, "message": "Product removed from cart successfully"}

        except Exception as e:
            return {
                "status": 500,
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def addtocart_get(self, user_id):
        try:
            cart = list(cart_collection.find({"userId": ObjectId(user_id)}))

            final_products = []
            for item in cart:
                product = products_collection.find_one({"_id": item.get("productId")})

                if product:
                    product["_id"] = str(product["_id"])
                    product["categoryId"] = str(product["categoryId"])
                    product["sellerId"] = str(product["sellerId"])
                    product["cartId"] = str(item["_id"])

                    final_products.append(product)

            return {
                "status": 200,
                "message": "Cart fetched successfully",
                "data": final_products,
            }

        except Exception as e:
            return {
                "status": 500,
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def cart_delete(self, user_id):
        try:
            res = cart_collection.delete_many({"userId": ObjectId(user_id)})

            return {"status": 200, "message": "Product removed from cart successfully"}

        except Exception as e:
            return {
                "status": 500,
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }
