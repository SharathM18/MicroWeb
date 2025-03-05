from datetime import datetime, timezone

from database.database import users_collection


class AuthModel:
    def __init__(self):
        pass

    # check if user is already exists or not
    def user_exists(self, email):
        try:
            user = users_collection.find_one({"email": email})
            if user is not None:
                return {
                    "status": "success",
                    "message": "User already exists.",
                    "data": user,
                    "exists": True,
                }
            else:
                return {
                    "status": "success",
                    "message": "User does't exists",
                    "error": "User does't exists",
                    "exists": False,
                }
        except Exception as e:
            return {
                "status": "error",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }

    # creating a user/ inserting new user
    def create_user(self, full_name, email, hashed_password, mobile_number):
        user_data = {
            "fullName": full_name,
            "email": email,
            "hashedAndSaltedPassword": hashed_password,
            "role": ["seller", "buyer"],
            "mobileNumber": mobile_number,
            "createdAt": datetime.now(timezone.utc),
            "modifiedAt": datetime.now(timezone.utc),
        }

        try:
            result = users_collection.insert_one(user_data)
            return {
                "status": "success",
                "message": "User created successfully!",
                "data": {
                    "user_id": str(result.inserted_id),
                },
            }
        except Exception as e:
            return {
                "status": "error",
                "message": "Something went wrong. Please try again later.",
                "error": str(e),
            }
