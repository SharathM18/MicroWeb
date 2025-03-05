from bson import ObjectId

from database.database import category_collection


class CategoryModel:
    def __init__(self):
        pass

    def get_category(self):
        try:
            categories = list(category_collection.find({}))

            for category in categories:
                category["_id"] = str(category["_id"])

            return {
                "status": "success",
                "message": "Retrieved all category successfully!",
                "data": {"categories": categories},
            }

        except Exception as e:
            return {
                "status": "fail",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }
