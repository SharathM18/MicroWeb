import re
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from flask import jsonify

from config.config import Config
from model.auth_model import AuthModel


class AuthController:
    def __init__(self):
        self.auth_model = AuthModel()

    @staticmethod
    def email_validation(email):
        email_pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        return re.match(email_pattern, email) is not None

    @staticmethod
    def password_validation(password):
        password_pattern = (
            r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        )
        return re.match(password_pattern, password) is not None

    @staticmethod
    def mobile_number_validation(mobile_number):
        mobile_number_Pattern = r"^\d{10}$"
        return re.match(mobile_number_Pattern, str(mobile_number)) is not None

    def generate_token(self, email, user_id):
        payload = {
            "email": email,
            "user_id": user_id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        }

        return jwt.encode(payload, Config.SECRETE_KEY, algorithm="HS256")

    def signup_controller(self, req_data):
        full_name = req_data.get("fullName")
        email = req_data.get("email")
        mobile_number = req_data.get("mobileNumber")
        password = req_data.get("password")

        # checking if all datas are present or not
        if not all([full_name, email, password]):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "All fields are required",
                        "error": "All fields are required",
                    }
                ),
                400,
            )

        # checking the fullname is valid or not
        if len(full_name) < 3:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Full name must atleast 3 characters",
                        "error": "Full name must atleast 3 characters",
                    }
                ),
                400,
            )

        # check if email is validate or not
        if not self.email_validation(email):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Invalid email format",
                        "error": f"{email} Invalid email format",
                    }
                ),
                400,
            )

        # if server error ocuur while checking user exists
        if self.auth_model.user_exists(email)["status"] == "error":
            return jsonify(db_response), 500

        # check if user is already exists or not
        if self.auth_model.user_exists(email).get("exists"):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "User already exists",
                        "error": f"{email} User already exists",
                    }
                ),
                400,
            )

        if not self.mobile_number_validation(mobile_number):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Mobile number must be exactly 10 digits",
                        "error": "Mobile number must be exactly 10 digits",
                    }
                ),
                400,
            )

        # check if passsword is validate or not
        if not self.password_validation(password):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character",
                        "error": "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character",
                    }
                ),
                400,
            )

        # hashing the password with gensalt(random string/ number)
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        # inserting the user data
        db_response = self.auth_model.create_user(
            full_name, email, hashed_password, int(mobile_number)
        )

        # if user creation successfully return the token and user_id(data)
        if db_response["status"] == "success":
            token = self.generate_token(email, db_response.get("user_id"))
            db_response["token"] = token
            return jsonify(db_response), 200

        return jsonify(db_response), 500

    def login_controller(self, req_data):
        email = req_data.get("email")
        password = req_data.get("password")

        # ckecking if all datas are present or not
        if not all([email, password]):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "All fields are required",
                        "error": "All fields are required",
                    }
                ),
                400,
            )

        # check if email is validate or not
        if not self.email_validation(email):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Invalid email format",
                        "error": f"{email} Invalid email format",
                    }
                ),
                400,
            )

        # check if passsword is validate or not
        if not self.password_validation(password):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character",
                        "error": "Password must be at least 8 characters, include one uppercase, one lowercase, one number, and one special character",
                    }
                ),
                400,
            )

        # check if user is already exists or not
        db_response = self.auth_model.user_exists(email)

        # if server error ocuur while checking user exists
        if db_response["status"] == "error":
            return jsonify(db_response), 500

        #  if user does't exists
        if not db_response["exists"]:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "User does't exists.",
                        "error": f"{email} User does't exists.",
                    }
                ),
                400,
            )

        # checking the password is valid or not
        if not bcrypt.checkpw(
            password.encode("utf-8"),
            db_response["data"]["hashedAndSaltedPassword"].encode("utf-8"),
        ):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Invalid Password.",
                        "error": "Invalid Password.",
                    }
                ),
                400,
            )

        token = self.generate_token(email, str(db_response["data"]["_id"]))

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "User login successfully",
                    "token": token,
                    "data": str(db_response["data"]["_id"]),
                }
            ),
            200,
        )

    # Refesh token for persistance connection
    def verify_token_controller(self, token):
        # checks for token is exists or not
        if not token:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Token is missing",
                        "error": "Token is missing",
                    }
                ),
                400,
            )

        # it execute if token is valid
        try:
            # decoding the JWT token for verification
            payload = jwt.decode(token, Config.SECRETE_KEY, algorithms=["HS256"])

            exp_timestamp = payload["exp"]
            exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)

            if exp_datetime < datetime.now(timezone.utc):
                return jsonify({"error": "Token has expired"}), 400

            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Refresh token verified successfully!",
                        "token": token,
                        "data": payload["user_id"],
                    }
                ),
                200,
            )

        except jwt.ExpiredSignatureError as e:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Token has expired. Please try to login again...",
                        "error": str(e),
                    }
                ),
                500,
            )

        except jwt.InvalidTokenError:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "Invalid token. Please try to login again...",
                        "error": "Invalid token",
                    }
                ),
                500,
            )
