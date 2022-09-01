from crypt import methods
from datetime import datetime
from flask import Flask,request,url_for,redirect,render_template
from flask_pymongo import PyMongo
from pymongo import MongoClient 

CONNECTION_STRING ="mongodb+srv://user:12345@attendance.kobg93v.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(CONNECTION_STRING)
db =client['attendance']

app = Flask(__name__,template_folder ='templates')

#time =datetime.date.today()

#to add student and course data in db
@app.route('/add',methods =['POST','GET'])
def choose():
   if request.method == 'POST':
    if request.form['ch'] == 'teacher':
        collection = db.subject
        collection.insert_one({'name':request.form['name']})

    elif  request.form['ch'] == 'student':
        collection =db.student 
        collection.insert_one({'name':request.form['name']})   
   return render_template('add.html')

#main indx page to select between teacher and 
@app.route('/',methods=['POST','GET'])
def main_page():
    if request.method == 'POST':
        if request.form['ch'] == 'teacher':
            return redirect(url_for('teacher'))
        elif request.form['ch'] == 'student':
            return redirect(url_for('student'))
    return render_template('main_page.html')

if __name__ == '__main__':
	app.run(debug=True)
