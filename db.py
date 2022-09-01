def get_db():
    from flask_pymongo import PyMongo
    from pymongo import MongoClient 

CONNECTION_STRING ="mongodb+srv://user:12345@attendance.kobg93v.mongodb.net/?retryWrites=true&w=majority"


client = MongoClient(CONNECTION_STRING)
db =client['attendance']

