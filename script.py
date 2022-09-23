from crypt import methods
import datetime
from flask import Flask,request,url_for,redirect,render_template
from pymongo import MongoClient 
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np

CONNECTION_STRING ="mongodb+srv://user:12345@attendance.kobg93v.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(CONNECTION_STRING)
db =client['attendance']

app = Flask(__name__,template_folder ='templates')

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    response.headers["Expires"] = '0'
    response.headers["Pragma"] = "no-cache"
    return response

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
            return redirect(url_for('auth'))
        elif request.form['ch'] == 'student':
            return redirect(url_for('student_ch'))
    return render_template('main_page.html')


@app.route('/auth',methods=['POST','GET'])
def auth():
    auth_db=db["auth"]
    for x in auth_db.find({},{'_id':0,'pin':1}):
        print(x['pin'])
        pin_db=(x['pin'])
    pin = request.form.get('pin')
    if(pin == pin_db):
        return redirect(url_for('select_teacher'))
    return render_template('auth.html')

#list of students and subjects
subject_ls =[]
student_ls = []

for x in db.student.find({},{'_id':0,'name':1}):
    student_ls.append(x['name'])

for x in db.subject.find({},{'_id':0,'name':1}):
    subject_ls.append(x['name'])

#route to select teacher from subject_ls
@app.route('/t',methods=['POST','GET'])
def select_teacher():
    value = request.form.get('ch')
    if value !=None:
        return redirect(url_for('teacher_ch',sub=value))
    return render_template('select_teacher.html',ls=subject_ls)

@app.route('/teacher_opt/<sub>/',methods=['POST','GET'])
def teacher_ch(sub):
    if request.method == 'POST':
        if request.form['ch'] == 'opt1':
            return redirect(url_for('index',sub=sub))
        elif request.form['ch'] == 'opt2':
            return redirect(url_for('export_data',sub=sub))
    return render_template('teacher_opt.html')

@app.route('/export/<sub>/',methods=['POST','GET'])
def export_data(sub):
    print(sub)
    if request.method == 'POST':
        start = request.form.get('start')
        end = request.form.get('end')
        df=data_to_pd(start=start,end=end,sub=sub)
        return render_template('data.html', column_names=df.columns.values, row_data=list(df.values.tolist()), zip=zip)
    return render_template('export_data.html')

@app.route('/s',methods=['POST','GET'])
def student_ch():
    name = request.form.get('name')
    sub = request.form.get('ch')
    if(name != None and sub != None):
        return redirect(url_for('student_opt',name=name,sub=sub))
    return render_template('select_student.html',student_ls=student_ls,subject_ls=subject_ls)

@app.route('/stu_opt/<name>/<sub>',methods=['POST','GET'])
def student_opt(name,sub):
    if request.method == 'POST':
        if request.form['ch'] == 'opt1':
            return redirect(url_for('student_option_1',name=name))
        elif request.form['ch'] == 'opt2':
            return redirect(url_for('student_option_2',name=name,sub=sub))
    return render_template('student_opt.html')
    
@app.route('/stu_ch_1/<name>',methods=['POST','GET'])
def student_option_1(name):
    ls=[]
    for i in subject_ls:
        sub_db = db[i]
        for x in sub_db.find({'name':name,'date':str(time)},{'_id':0,'attd':1}):
            ls.append(i+"-"+ x['attd'])
    if len(ls) == 0:
        ls.append("No class attended today")    
    return render_template('stu_opt_1.html',ls=ls)
    
@app.route('/stu_ch_2/<name>/<sub>',methods=['POST','GET'])
def student_option_2(name,sub):
    sub_db=db[sub]
    count_db=db["count"]
    for x in count_db.find({'name':sub},{'_id':0,'count':1}):
        total_class=x['count']
    attd_class=0
    for x in sub_db.find({'name':name}):
        attd_class+=1    
    perc=attd_class/int(total_class)*100
    return render_template('percentage.html',x=perc,sub=sub)

#to create a webpage with student_ls to take attd for today
@app.route('/<sub>/',methods=['POST','GET'])
def index(sub):
    if request.method == 'POST':
        db_sub = db[sub]
        ls = request.form.getlist('ch') 
        for i in ls:
            db_sub.insert_one(({'name':i,'date':str(time),'attd':'present'}))        
        update_total_count(sub)
        return render_template('attd_success.html',subject= sub,date=str(time))            
    return render_template('attd.html',student_ls=student_ls) 


@app.route('/upload',methods=['POST','GET'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            print('No file part')
            return redirect(request.url)
        file = request.files['file']
        sub= request.form['ch']
        excel_to_pd(file,sub)
    return render_template('upload_excel.html',ls=subject_ls)

def update_total_count(sub):
    count_db=db["count"]
    total=0
    for x in count_db.find({'name':sub},{'_id':0,'count':1}):
        total=int(x['count'])
    count_db.update_one({'name':sub},{"$set":{'count':str(total+1)}},upsert=False)

def data_to_pd(start,end,sub):
    start_o=datetime.datetime.strptime(start, '%Y-%m-%d').date()
    end_o=datetime.datetime.strptime(end, '%Y-%m-%d').date()
    file_name = 'AttdData.xlsx'
    data = []
    data.append(student_ls)   
    col_name = ['Name']
    while (start_o!=end_o):
        col_name.append(str(start_o))
        ls=[]
        data_entry = []
        for x in db[sub].find({'date':str(start_o)},{'_id':0,'name':1}):
            ls.append(x['name'])    
        for x in student_ls:
            if x in ls:
                data_entry.append("P")
            else :
                data_entry.append("-")   
        data.append(data_entry)  
        start_o = start_o + datetime.timedelta(days=1)

    df = pd.DataFrame(data)
    df=df.transpose()
    index_ls=np.arange(1, len(df)+2,)
    index_ls=np.delete(index_ls,7)
    df.index = index_ls
    df.columns=col_name
    #df.to_excel(file_name)
    #print(df)
    return df

def excel_to_pd(file,sub):
    df =pd.read_excel(file,index_col=0)  
    sub_db=db[sub]
    col_ls=[]
    for x in df.columns:
        if x not in sub_db.distinct('date'):
            col_ls.append(x)

    for ind in df.index:
        for col in df.columns:
            if col in col_ls:
                if df[col][ind] == 'P':
                    sub_db.insert_one(({'name':df['Name'][ind],'date':col,'attd':'present'}))      
                    
if __name__ == '__main__':
	app.run(debug=True)


