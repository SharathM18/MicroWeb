from flask import jsonify

from model.products_model import ProductsModel
from utils.cloudinary import upload_image


class ProductsController:
    def __init__(self):
        self.products_model = ProductsModel()

    def add_seller_product(self, product):
        required_fields = [
            "sellerId",
            "categoryId",
            "title",
            "description",
            "price",
            "stock",
            "images",
        ]

        missing_fields = [field for field in required_fields if not product.get(field)]

        if "sellerId" in missing_fields:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Something went wrong. please try again (sellerId)",
                        "error": "Something went wrong. please try again (sellerId)",
                    }
                ),
                400,
            )

        if missing_fields:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": f"Missing fields: {', '.join(missing_fields)}",
                        "error": f"Missing fields: {', '.join(missing_fields)}",
                    }
                ),
                400,
            )

        if len(product["title"]) < 3:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Product title must be at least 3 characters",
                        "error": "Product title must be at least 3 characters",
                    }
                ),
                400,
            )

        if len(product["description"]) < 20:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Description must be at least 20 characters",
                        "error": "Description must be at least 20 characters",
                    }
                ),
                400,
            )

        # Ensure stock is an integer
        try:
            product["stock"] = int(product["stock"])
            if product["stock"] < 0:
                return (
                    jsonify(
                        {
                            "status": "fail",
                            "message": "Stock should be 0 or more",
                            "error": "Stock should be 0 or more",
                        }
                    ),
                    400,
                )
        except ValueError:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Stock must be a valid integer",
                        "error": "Stock must be a valid integer",
                    }
                ),
                400,
            )

        # Ensure price is a float or integer
        try:
            product["price"] = float(product["price"])
            if product["price"] <= 0:
                return (
                    jsonify(
                        {
                            "status": "fail",
                            "message": "Price should be more than 0",
                            "error": "Price should be more than 0",
                        }
                    ),
                    400,
                )
        except ValueError:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Price must be a valid number",
                        "error": "Price must be a valid number",
                    }
                ),
                400,
            )

        if not product["images"]:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "At least one image is required",
                        "error": "At least one image is required",
                    }
                ),
                400,
            )

        print("Received images:", product["images"])

        image_urls = []
        for image in product["images"]:
            upload_result = upload_image(image, product["sellerId"])

            if upload_result.get("status") == "fail":
                return jsonify(upload_result), 400

            image_urls.append(upload_result["data"]["url"])

        product["images"] = image_urls

        db_response = self.products_model.add_seller_product(product)
        if db_response.get("status") == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def get_seller_product(self, seller_id, category_id=None, sort_value=None):
        query = {"sellerId": seller_id}

        if category_id:
            query["categoryId"] = category_id

        sort_options = {"asc": [("price", 1)], "desc": [("price", -1)]}
        sort_order = sort_options.get(sort_value, None)

        db_response = self.products_model.get_seller_product(query, sort_order)

        if db_response.get("status") == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def update_seller_product(self, product_id, product):
        required_fields = [
            "sellerId",
            "categoryId",
            "title",
            "description",
            "price",
            "stock",
        ]

        missing_fields = [field for field in required_fields if not product.get(field)]

        if "sellerId" in missing_fields:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Something went wrong. please try again",
                        "error": "Something went wrong. please try again",
                    }
                ),
                400,
            )

        if missing_fields:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": f"Missing fields: {', '.join(missing_fields)}",
                        "error": f"Missing fields: {', '.join(missing_fields)}",
                    }
                ),
                400,
            )

        if len(product["title"]) < 3:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Product title must be at least 3 characters",
                        "error": "Product title must be at least 3 characters",
                    }
                ),
                400,
            )

        if len(product["description"]) < 20:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Description must be at least 20 characters",
                        "error": "Description must be at least 20 characters",
                    }
                ),
                400,
            )

        # Ensure stock is a integer
        try:
            product["stock"] = int(product["stock"])
            if product["stock"] < 0:
                return (
                    jsonify(
                        {
                            "status": "fail",
                            "message": "Stock should be 0 or more",
                            "error": "Stock should be 0 or more",
                        }
                    ),
                    400,
                )
        except ValueError:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Stock must be a valid integer",
                        "error": "Stock must be a valid integer",
                    }
                ),
                400,
            )

        # Ensure price is a float or integer
        try:
            product["price"] = float(product["price"])
            if product["price"] <= 0:
                return (
                    jsonify(
                        {
                            "status": "fail",
                            "message": "Price should be more than 0",
                            "error": "Price should be more than 0",
                        }
                    ),
                    400,
                )
        except ValueError:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Price must be a valid number",
                        "error": "Price must be a valid number",
                    }
                ),
                400,
            )

        db_response = self.products_model.update_seller_product(product_id, product)
        if db_response.get("status") == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def delete_seller_product(self, product_id):
        db_response = self.products_model.delete_seller_product(product_id)

        if db_response.get("status") == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def get_products(self, category_id=None, sort_value=None):
        query = {}
        if category_id:
            query["categoryId"] = category_id

        sort_options = {"asc": [("price", 1)], "desc": [("price", -1)]}
        sort_order = sort_options.get(sort_value, None)

        db_response = self.products_model.get_products(query, sort_order)

        if db_response.get("status") == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200
