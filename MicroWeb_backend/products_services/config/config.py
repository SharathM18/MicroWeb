from os import environ

from dotenv import load_dotenv

load_dotenv()


# configarature files for the app
class Config:
    MONGO_URI = environ.get("MONGO_URI")
    SECRET_KEY = environ.get("SECRET_KEY")
    CLOUDINARY_NAME = environ.get("CLOUD_NAME")
    CLOUDINARY_API_KEY = environ.get("API_KEY")
    CLOUDINARY_API_SECRET = environ.get("API_SECRET")
