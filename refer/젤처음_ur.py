from flask import Flask,render_template,Blueprint,request
import pymysql
from db_connector import db



#로컬호스트:포트번호/user/url_prefix에 적힌 값 적고
user_bp = Blueprint('user', __name__, url_prefix='/user')




#프론트엔드에 값을 넣어달라고 요청하는코드
@user_bp.route('/save')
def save():
    args = request.args
    param = args.to_dict()
    
    id = param.get('id')
    pw = param.get('pw')
    name = param.get('n')
    birth = param.get('b')
    height = param.get('h')
    weight = param.get('w')
    gender = param.get('g')
    
    
    #SYSDATE는 알아서 현재 날짜를 구해주기 때문에 execute 프론트 엔드에서 받아올 필요없음
    #values에서 sql문을 보내서 데이터를 읽게 할때는 %d %f 이런거 구분없이 무조건 %s
    cursor = db.cursor()
    sql = """
        INSERT INTO user
        (id,pw,name,birth,height,weight,gender,created_time)
        VALUES
        (%s,%s,%s,%s,%s,%s,%s, SYSDATE()) 
                   """
    
    cursor.execute(sql, (id,pw,name,birth,height,weight,gender))
    db.commit()
    db.close()
            
    
    return 'ok'

#로그인
@user_bp.route('/getByIdAndPw')
def getByIdAndPw():
    args = request.args
    param = args.to_dict()
    
    id = param.get('id')
    pw = param.get('pw')
    
    cursor = db.cursor()
    sql = """
        SELECT * FROM user
        WHERE
            id = %s AND pw = %s
    """
    
    cursor.execute(sql,(id,pw))
    result = cursor.fetchone()
    print(result)
    
    if(result):
        return 'ok'
    else:
        return 'fail'
#select랑 insert랑 다르다 fetchone() 이랑 commit


@user_bp.route('/all_users')
def hello_world():
    cursor = db.cursor()
    cursor.execute("""
        SELECT *
            FROM user
        """)
    result = cursor.fetchall()

    print(result)
    return 'Hello World!'