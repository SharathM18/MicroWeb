import re

from flask import jsonify

from model.address_model import AddressModel


class AddressController:
    def __init__(self):
        self.address_model = AddressModel()

    @staticmethod
    def mobile_number_validation(mobile_number):
        mobile_number_Pattern = r"^\d{10}$"
        return re.match(mobile_number_Pattern, str(mobile_number)) is not None

    @staticmethod
    def pincode_validation(pincode):
        pincode_pattern = r"^\d{6}$"
        return re.match(pincode_pattern, pincode) is not None

    def add_address(self, address):
        required_fields = [
            "userId",
            "country",
            "fullName",
            "addressLineOne",
            "addressLineTwo",
            "city",
            "state",
            "pincode",
            "phoneNumber",
        ]

        # Validate missing fields
        missing_fields = [field for field in required_fields if not address.get(field)]

        if "userId" in missing_fields:
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

        if len(address["fullName"]) < 3:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Full name length should be more than 3",
                        "error": "Full name length should be more than 3",
                    }
                ),
                400,
            )

        if not self.pincode_validation(address["pincode"]):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Pincode must be exactly 6 digits",
                        "error": "Pincode must be exactly 6 digits",
                    }
                ),
                400,
            )

        if not self.mobile_number_validation(address["phoneNumber"]):
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

        db_response = self.address_model.add_address(address)
        if db_response["status"] == "error":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def get_address(self, user_id):

        db_response = self.address_model.get_address(user_id)

        if db_response["status"] == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def update_address(self, address_id, address):
        required_fields = [
            "userId",
            "country",
            "fullName",
            "addressLineOne",
            "addressLineTwo",
            "city",
            "state",
            "pincode",
            "phoneNumber",
        ]

        # Validate missing fields
        missing_fields = [field for field in required_fields if not address.get(field)]

        if "userId" in missing_fields:
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

        if len(address["fullName"]) < 3:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Full name length should be more than 3",
                        "error": "Full name length should be more than 3",
                    }
                ),
                400,
            )

        if not self.pincode_validation(address["pincode"]):
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Pincode must be exactly 6 digits",
                        "error": "Pincode must be exactly 6 digits",
                    }
                ),
                400,
            )

        if not self.mobile_number_validation(address["phoneNumber"]):
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

        db_response = self.address_model.update_address(address_id, address)
        if db_response["status"] == "fail":
            return jsonify(db_response), 500

        return jsonify(db_response), 200

    def delete_address(self, user_id, address_id):

        db_response = self.address_model.delete_address(user_id, address_id)

        if db_response["status"] == "fail":
            return jsonify(db_response), 400

        return jsonify(db_response), 200
