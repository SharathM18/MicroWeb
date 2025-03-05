from flask import jsonify

from model.user_model import UserModel


class UserController:
    def __init__(self):
        self.user = UserModel()

    # retrieve entire user data
    def profile_data(self, user_id):

        db_respones = self.user.get_user(user_id)

        if db_respones["status"] == "error":
            return jsonify(db_respones), 500

        return jsonify(db_respones), 200
