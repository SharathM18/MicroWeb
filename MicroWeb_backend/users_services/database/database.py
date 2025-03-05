from pymongo import MongoClient

from config.config import Config

# Initialize MongoDB atlas client and database
client = MongoClient(Config.MONGO_URI)
db = client.get_database("users_db")

# Define collections
users_collection = db.users
address_collection = db.address
