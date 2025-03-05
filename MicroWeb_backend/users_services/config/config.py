from os import environ

from dotenv import load_dotenv

load_dotenv()


# configaration files for app
class Config:
    MONGO_URI = environ.get("MONGO_URI")
    SECRETE_KEY = environ.get("SECRETE_KEY")
