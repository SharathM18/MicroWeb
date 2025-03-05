from flask import jsonify

from model.category_model import CategoryModel


class CategoryController:
    def __init__(self):
        self.category_model = CategoryModel()

    def get_category(self):
        db_response = self.category_model.get_category()

        if db_response.get("status") == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200
