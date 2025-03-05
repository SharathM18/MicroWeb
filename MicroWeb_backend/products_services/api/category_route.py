from flask import Blueprint

from controller.category_controller import CategoryController

category_controller = CategoryController()
category_bp = Blueprint("category_route", __name__)


@category_bp.route("/category", methods=["GET"])
def get_category():
    return category_controller.get_category()
