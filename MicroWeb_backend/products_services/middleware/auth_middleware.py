from datetime import datetime, timezone
from functools import wraps

import jwt
from flask import jsonify, request

from config.config import Config


def token_required(f):
    """Middleware to protect routes by requiring a valid JWT token."""

    @wraps(f)
    def decorated_func(*args, **kwargs):
        token = request.headers.get("x-auth-token")

        if not token:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Token is missing",
                        "error": "Token is missing",
                    }
                ),
                401,
            )

        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])

            exp_timestamp = payload["exp"]
            exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)

            if exp_datetime < datetime.now(timezone.utc):
                return (
                    jsonify(
                        {
                            "status": "fail",
                            "message": "Token has expired",
                            "error": "Token has expired",
                        }
                    ),
                    401,
                )

        except jwt.ExpiredSignatureError:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Token has expired",
                        "error": "Token has expired",
                    }
                ),
                401,
            )

        except jwt.InvalidTokenError:
            return (
                jsonify(
                    {
                        "status": "fail",
                        "message": "Invalid token",
                        "error": "Invalid token",
                    }
                ),
                401,
            )

        return f(*args, **kwargs)

    return decorated_func
