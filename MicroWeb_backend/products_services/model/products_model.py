from bson import ObjectId

from database.database import products_collection
from utils.cloudinary import delete_image, extract_public_id


class ProductsModel:
    def __init__(self):
        pass

    def add_seller_product(self, product):
        try:
            product["sellerId"] = ObjectId(product.get("sellerId"))
            product["categoryId"] = ObjectId(product.get("categoryId"))

            result = products_collection.insert_one(product)

            return {
                "status": "success",
                "message": "Product added successfully",
                "data": {"productId": str(result.inserted_id)},
            }

        except Exception as e:
            return {
                "status": "fail",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def get_seller_product(self, query, sort_order):
        try:
            query["sellerId"] = ObjectId(query.get("sellerId"))

            if query.get("categoryId"):
                query["categoryId"] = ObjectId(query.get("categoryId"))

            products = list(
                products_collection.find(query).sort(sort_order)
                if sort_order
                else products_collection.find(query)
            )

            for product in products:
                product["_id"] = str(product.get("_id"))
                product["sellerId"] = str(product.get("sellerId"))
                product["categoryId"] = str(product.get("categoryId"))

            return {
                "status": "success",
                "message": "Seller products retrieved successfully",
                "data": {
                    "products": products,
                },
            }

        except Exception as e:
            return {
                "status": "fail",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def update_seller_product(self, product_id, product):
        try:

            product["sellerId"] = ObjectId(product.get("sellerId"))
            product["categoryId"] = ObjectId(product.get("categoryId"))

            result = products_collection.update_one(
                {"_id": ObjectId(product_id)}, {"$set": product}
            )

            if result.matched_count == 0:
                return {
                    "status": "fail",
                    "message": "Product not found or no changes made",
                    "error": "Product not found or no changes made",
                }

            return {
                "status": "success",
                "message": "Product Update successfully",
            }

        except Exception as e:
            return {
                "status": "fail",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def delete_seller_product(self, product_id):
        try:
            product = products_collection.find_one({"_id": ObjectId(product_id)})

            if not product:
                return {
                    "status": "fail",
                    "message": "Product not found",
                    "error": "Product not found",
                }

            for image_url in product["images"]:
                public_id = extract_public_id(image_url)
                res = delete_image(public_id)

                if res.get("status") == "fail":
                    return res

            result = products_collection.delete_one({"_id": ObjectId(product_id)})

            if result.deleted_count == 0:
                return {
                    "status": "fail",
                    "message": "Product not found",
                    "error": "Product not found",
                }

            return {
                "status": "success",
                "message": "Address deleted successfully",
            }

        except Exception as e:
            return {
                "status": "fail",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def get_products(self, query, sort_order):
        try:
            if query:
                query["categoryId"] = ObjectId(query.get("categoryId"))

            products = list(
                (
                    products_collection.find(query).sort(sort_order)
                    if sort_order
                    else products_collection.find(query)
                )
            )

            for product in products:
                product["_id"] = str(product.get("_id"))
                product["sellerId"] = str(product.get("sellerId"))
                product["categoryId"] = str(product.get("categoryId"))

            return {
                "status": "success",
                "message": "Products retrieved successfully",
                "data": {
                    "products": products,
                },
            }

        except Exception as e:
            return {
                "status": "fail",
                "error": "Something went wrong. Please try again later.",
                "error": str(e),
            }
