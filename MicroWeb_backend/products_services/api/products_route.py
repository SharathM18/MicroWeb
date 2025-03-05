from flask import Blueprint, request

from controller.products_controller import ProductsController
from middleware.auth_middleware import token_required

product_controller = ProductsController()
products_bp = Blueprint("products_route", __name__)


@products_bp.route("/myproducts/addproduct", methods=["POST"])
@token_required
def add_seller_product():
    """here we are recieve the data in the form of "Content-Type": "multipart/form-data"""
    req_data = {
        "sellerId": request.form.get("sellerId"),
        "categoryId": request.form.get("categoryId"),
        "title": request.form.get("title"),
        "description": request.form.get("description"),
        "price": request.form.get("price"),
        "stock": request.form.get("stock"),
        "images": request.files.getlist("images"),
    }

    return product_controller.add_seller_product(req_data)


# this route for the specific sellers products
@products_bp.route("/myproducts/<seller_id>", methods=["GET"])
@token_required
def get_seller_product(seller_id):
    category_id = request.args.get("categoryId")
    sort_value = request.args.get("sortValue")
    return product_controller.get_seller_product(seller_id, category_id, sort_value)


@products_bp.route("/myproducts/updateproduct/<product_id>", methods=["PUT"])
@token_required
def update_seller_product(product_id):
    req_data = request.get_json()
    return product_controller.update_seller_product(product_id, req_data)


@products_bp.route("/myproducts/deleteproduct/<product_id>", methods=["DELETE"])
@token_required
def delete_seller_product(product_id):
    return product_controller.delete_seller_product(product_id)


# this route for all the products
@products_bp.route("/products", methods=["GET"])
def get_products():
    category_id = request.args.get("categoryId")
    sort_value = request.args.get("sortValue")
    return product_controller.get_products(category_id, sort_value)
