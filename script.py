from crypt import methods
import datetime
from flask import Flask,request,url_for,redirect,render_template
from flask_pymongo import PyMongo
from pymongo import MongoClient 

CONNECTION_STRING ="mongodb+srv://user:12345@attendance.kobg93v.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(CONNECTION_STRING)
db =client['attendance']

app = Flask(__name__,template_folder ='templates')

time =datetime.date.today()

#to add student and course data in db
@app.route('/add',methods =['POST','GET'])
def add():
   if request.method == 'POST':
    if request.form['ch'] == 'teacher':
        collection = db.subject
        collection.insert_one({'name':request.form['name']})
        db_sub = db[request.form['name']]
        db_sub.insert_one({'test':'delete this'})

    elif  request.form['ch'] == 'student':
        collection =db.student 
        collection.insert_one({'name':request.form['name']})   
   return render_template('add.html')

#main index page to select between teacher and 
@app.route('/',methods=['POST','GET'])
def main_page():
    if request.method == 'POST':
        if request.form['ch'] == 'teacher':
            return redirect(url_for('select_teacher'))
        elif request.form['ch'] == 'student':
            return redirect(url_for('select_student'))
    return render_template('main_page.html')

#list of students and subjects
subject_ls =db.subject.distinct('name')
student_ls = db.student.distinct('name')

#route to select teacher from subject_ls
@app.route('/t',methods=['POST','GET'])
def select_teacher():
    value = request.form.get('ch')
    if value !=None:
        return redirect(url_for('index',sub=value))
    return render_template('select_teacher.html',ls=subject_ls)

#to create a webpage with student_ls to take attd for today
@app.route('/<sub>/',methods=['POST','GET'])
def index(sub):
    if request.method == 'POST':
        db_sub = db[sub]
        for i in student_ls:
            db_sub.insert_one(({'name':i,'date':str(time),'attd':request.form['ch']}))         
    return render_template('attd.html',student_ls=student_ls) 

if __name__ == '__main__':
	app.run(debug=True)
