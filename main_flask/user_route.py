from flask import Flask, render_template, Blueprint, request, jsonify, session
from flask_bcrypt import Bcrypt
import secrets
import re  
#from flask_cors import CORS
from db_connector import db

# Flask 앱 초기화 및 bcrypt 초기화
app = Flask(__name__)
bcrypt = Bcrypt(app)
 

app.secret_key = secrets.token_hex(24)


# 로컬호스트:포트번호/user/url_prefix에 적힌 값 적고
user_bp = Blueprint('user', __name__, url_prefix='/user')

#CORS(user_bp, origins=["http://www.eatply.online"])


# 비밀번호 검사: 8~12자, 영어, 숫자, 특수문자 포함
#def validate_password(pw):
   #if 8 <= len(pw) <= 12:
       # if re.search("[A-Za-z]", pw) and re.search("[0-9]", pw) and re.search("[!@#$%^&*()_+]", pw):
       #     return True
   # return False

        



# 회원가입
@user_bp.route('/join', methods=['POST'])
def save():
    data = request.json

    id = data.get('id')
    pw = data.get('pw')


    #if id is None or pw is None:
        #return jsonify({'message': 'Invalid ID or Password'}), 400
# 아이디와 비밀번호 검증
    #if len(id) < 5 or not validate_password(pw):
        #return jsonify({'message': 'Invalid ID or Password'}), 400

    # 비밀번호 해싱
    hashed_pw = bcrypt.generate_password_hash(pw).decode('utf-8')

    name = data.get('name')
    age = data.get('age')
    height = data.get('height')
    weight = data.get('weight')
    gender = data.get('gender')
    excercise = data.get('excercise')
    goal_weight = data.get('goal_weight')
    
    
    
    
    
    cursor = db.cursor()
    sql = """
        INSERT INTO user
        (id, pw, name, age, height, weight , gender, excercise, goal_weight, created_time)
        VALUES
        (%s, %s, %s, %s, %s, %s, %s, %s, %s, SYSDATE())
                   """

    cursor.execute(sql, (id, hashed_pw, name, int(age), height, weight, int(gender), int(excercise), goal_weight
                         , )) 
    db.commit()
    db.close()

    return jsonify({' result' : 'ok'})

# 로그인
@user_bp.route('/login', methods = ['POST'])
def login():
    data = request.json

    id = data.get('id')
    pw = data.get('password')

    cursor = db.cursor()
    sql = """
        SELECT pw FROM user
        WHERE id = %s
    """
    cursor.execute(sql, (id,))
    result = cursor.fetchone()

    if result and bcrypt.check_password_hash(result[0], pw):
        session ['user_id'] = id
        return jsonify({' result' : 'ok'})
    else:
        return jsonify({'result' : 'fail'}) , 401
    
    
#로그아웃    
@user_bp.route('/logout', methods = ['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify('Logged out')


#마이페이지
@user_bp.route('/mypage', methods = ['POST'] )
def mypage():
    user_id = session.get('user_id')
    
    
    if not user_id :
        return jsonify({'error': 'User not logged in'}), 401
    
    cursor = db.cursor()
    
    sql = """"
    SELECT name, age, weight, height, gender, excercise, goal_weight FROM user
    WHERE id = %s
    """
    
    
    cursor.execute(sql,(user_id) )
    result = cursor.fetchone()
    
    if result:
        name, age, weight, height, gender, exercise, goal_weight = result
    
        basal_metabolism_value = basal_metabolism(weight, height, gender, exercise)  # 기초대사량 계산
        user_info = {
            'name': name,
            'age': age,
            'weight': weight,
            'height': height,
            'gender': gender,
            'exercise': exercise,
            'goal_weight': goal_weight,
            'basal_metabolism': basal_metabolism_value
        }
        return jsonify(user_info)  
    else:
        return jsonify({'error': 'User not found'}), 404  # 사용자가 데이터베이스에 없는 경우
    
    
    


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
