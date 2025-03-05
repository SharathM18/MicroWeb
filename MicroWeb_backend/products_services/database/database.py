from pymongo import MongoClient

from config.config import Config

# connect to the database and create the database
client = MongoClient(Config.MONGO_URI)
db = client.get_database("products_db")


# define the collections
category_collection = db.category
products_collection = db.products
