from flask import Flask, render_template, Blueprint, request
from flask_bcrypt import Bcrypt
import pymysql
import re  
from db_connector import db

# Flask 앱 초기화 및 bcrypt 초기화
app = Flask(__name__)
bcrypt = Bcrypt(app)

# 로컬호스트:포트번호/user/url_prefix에 적힌 값 적고
user_bp = Blueprint('user', __name__, url_prefix='/user')

# 비밀번호 검사: 8~12자, 영어, 숫자, 특수문자 포함
def validate_password(pw):
    if 8 <= len(pw) <= 12:
        if re.search("[A-Za-z]", pw) and re.search("[0-9]", pw) and re.search("[!@#$%^&*()_+]", pw):
            return True
    return False

# 회원가입
@user_bp.route('/save', methods=['POST'])
def save():
    args = request.args
    param = args.to_dict()

    id = param.get('id')
    pw = param.get('pw')

    # 아이디와 비밀번호 검증
    if len(id) < 5 or not validate_password(pw):
        return 'Invalid ID or Password'

    # 비밀번호 해싱
    hashed_pw = bcrypt.generate_password_hash(pw).decode('utf-8')

    name = param.get('n')
    birth = param.get('b')
    height = param.get('h')
    weight = param.get('w')
    gender = param.get('g')
    excercise = param.get('e')
    goal = param.get('go')
    meal_time = param.get('mt')
    
    cursor = db.cursor()
    sql = """
        INSERT INTO user
        (id, pw, name, birth, height, weight, gender, excercise, goal, meal_time, created_time)
        VALUES
        (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, SYSDATE())
                   """

    cursor.execute(sql, (id, hashed_pw, name, birth, int(height), int(weight), gender, excercise, goal, excercise
                         , meal_time))
    db.commit()
    db.close()

    return 'ok'

# 로그인
@user_bp.route('/getByIdAndPw')
def getByIdAndPw():
    args = request.args
    param = args.to_dict()

    id = param.get('id')
    pw = param.get('pw')

    cursor = db.cursor()
    sql = """
        SELECT pw FROM user
        WHERE id = %s
    """
    cursor.execute(sql, (id,))
    result = cursor.fetchone()

    if result and bcrypt.check_password_hash(result[0], pw):
        return 'ok'
    else:
        return 'fail'

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
