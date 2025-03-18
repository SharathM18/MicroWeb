from bson import ObjectId

from database.database import address_collection, orders_collection, products_collection


class OrderModel:
    def __init__(self):
        pass

    def order(self, user_id):
        try:
            user_id = ObjectId(user_id)

            # Get all orders placed by the user
            order_list = list(orders_collection.find({"userId": user_id}))

            if not order_list:
                return {
                    "status": 404,
                    "message": "No orders found for this user.",
                    "data": [],
                }

            # Create a list to store all orders history
            final_order_history = []

            # Loop through each order document
            for order in order_list:
                # Prepare a dictionary for each order summary
                order_data = {
                    "orderId": str(order["_id"]),  # Convert ObjectId to string
                    "orderPlacedDate": order["orderPlacedDate"],
                    "shippingAddress": {},
                    "products": [],
                }

                # Get the shipping address and ensure no ObjectId in data
                user_address = address_collection.find_one(
                    {"_id": order["shippingAddress"]},
                    {"userId": 0},
                )

                if user_address:
                    del user_address["_id"]
                    order_data["shippingAddress"] = user_address
                else:
                    # Optional: log that the address was not found, or handle it gracefully
                    order_data["shippingAddress"] = {}

                # Optional: Ensure shippingAddress is not None
                order_data["shippingAddress"] = user_address if user_address else {}

                # Loop through the products in each order
                for ordered_product in order["product"]:
                    # Fetch product info from products collection
                    prod_info = products_collection.find_one(
                        {"_id": ordered_product["productId"]},
                        {
                            "_id": 0,  # we don't need Mongo's ObjectId here
                            "title": 1,
                            "images": 1,
                        },
                    )

                    if prod_info:
                        order_data["products"].append(
                            {
                                "title": prod_info.get("title"),
                                "images": prod_info.get("images"),
                                "totalPrice": ordered_product.get("totalPrice"),
                                "quantity": ordered_product.get("selectedQuantity"),
                            }
                        )

                # Append this order's data to the history list
                final_order_history.append(order_data)

            return {
                "status": 200,
                "message": "Orders retrieved successfully",
                "data": final_order_history,
            }

        except Exception as e:
            return {
                "status": 500,
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }
