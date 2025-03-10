from datetime import datetime, timezone

from bson import ObjectId

from database.database import address_collection, users_collection


class AddressModel:
    def __init__(self):
        pass

    def add_address(self, address):
        try:
            address["userId"] = ObjectId(address.get("userId"))
            address["createdAt"] = datetime.now(timezone.utc)
            address["modifiedAt"] = datetime.now(timezone.utc)

            result = address_collection.insert_one(address)

            users_collection.update_one(
                {"_id": address.get("userId")},
                {"$set": {"modifiedAt": datetime.now(timezone.utc)}},
            )

            return {
                "status": "success",
                "message": "Address added successfully",
                "data": str(result.inserted_id),
            }

        except Exception as e:
            return {
                "status": "error",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def get_address(self, user_id):
        try:
            addresses = list(address_collection.find({"userId": ObjectId(user_id)}))

            for address in addresses:
                address["_id"] = str(address["_id"])
                address["userId"] = str(address["userId"])

            return {
                "status": "success",
                "message": "Retrieved addresses successfully",
                "data": addresses,
            }

        except Exception as e:
            return {
                "status": "fail",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    def update_address(self, address_id, address):
        try:
            if "_id" in address:
                del address["_id"]
                del address["createdAt"]

            address["userId"] = ObjectId(address.get("userId"))
            address["modifiedAt"] = datetime.now(timezone.utc)

            result = address_collection.update_one(
                {"_id": ObjectId(address_id)}, {"$set": address}
            )

            if result.matched_count == 0:
                return {
                    "status": "failure",
                    "message": "Address not found or no changes made",
                }

            users_collection.update_one(
                {"_id": address.get("userId")},
                {"$set": {"modifiedAt": datetime.now(timezone.utc)}},
            )

            return {
                "status": "success",
                "message": "Address Update successfully",
            }

        except Exception as e:
            return {"status": "failure", "error": str(e)}

    def delete_address(self, user_id, address_id):
        try:
            result = address_collection.delete_one({"_id": ObjectId(address_id)})

            if result.deleted_count == 0:
                return {
                    "status": "fail",
                    "message": "Address not found",
                    "error": "Address not found",
                }

            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"modifiedAt": datetime.now(timezone.utc)}},
            )

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
