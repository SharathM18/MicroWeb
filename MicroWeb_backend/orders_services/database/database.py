from pymongo import MongoClient

from config.config import Config

# connect to the database
client = MongoClient(Config.MONGO_URI)
order_db = client.get_database("orders")
users_db = client.get_database("users_db")
products_db = client.get_database("products_db")

# define the collection
orders_collection = order_db.orders
cart_collection = order_db.cart
address_collection = users_db.get_collection("address")
products_collection = products_db.get_collection("products")
