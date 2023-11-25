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
    exercise = data.get('excercise')
    goal_weight = data.get('goal_weight')
    
    
    
    
    
    cursor = db.cursor()
    sql = """
        INSERT INTO USER
        (id, pw, name, age, height, weight , gender, exercise,  created_time, goal_weight)
        VALUES
        (%s, %s, %s, %s, %s, %s, %s, %s, SYSDATE(), %s )
                   """

    cursor.execute(sql, (id, hashed_pw, name, int(age), height, weight, int(gender), int(exercise), goal_weight
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
        SELECT pw FROM User
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
@user_bp.route('/mypage', methods=['GET'])
def mypage():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    cursor = db.cursor()

    # USER 테이블에서 정보 가져오기
    sql_user = """
    SELECT name, age, weight, height, gender, exercise, goal_weight FROM USER
    WHERE id = %s
    """
    cursor.execute(sql_user, (user_id,))
    result_user = cursor.fetchone()

    # MYPAGE 테이블에서 활동대사량 추출
    sql_mypage = """
    SELECT active_meta FROM MYPAGE
    WHERE user_id = %s
    """
    cursor.execute(sql_mypage, (user_id,))
    result_mypage = cursor.fetchone()

    if result_user and result_mypage:
        name, age, weight, height, gender, exercise, goal_weight = result_user
        active_meta = result_mypage[0]

        
        user_info = {
            'name': name,
            'age': age,
            'weight': weight,
            'height': height,
            'gender': gender,
            'exercise': exercise,
            'goal_weight': goal_weight,
            'basal_meta': active_meta
        }
        return jsonify(user_info)
    else:
        
        return jsonify({'error': 'User information not found'}), 404


def get_helpbar_info(id, date):
    cur = db.cursor()
    
    helpbar_name_sql = "SELECT name FROM USER WHERE id = %s"
    cur.execute(helpbar_name_sql, (id,))
    helpbar_name = cur.fetchone()

    helpbar_meta_sql = "SELECT active_meta FROM MYPAGE WHERE id = %s"
    cur.execute(helpbar_meta_sql, (id,))
    helpbar_meta = cur.fetchone()

    morningKcal_sql = "SELECT SUM(food_kcal) AS Morkcal FROM PLANNER WHERE id = %s AND date = %s AND meal_when = 1"
    lunchKcal_sql = "SELECT SUM(food_kcal) AS Lunkcal FROM PLANNER WHERE id = %s AND date = %s AND meal_when = 2"
    dinnerKcal_sql = "SELECT SUM(food_kcal) AS Dinkcal FROM PLANNER WHERE id = %s AND date = %s AND meal_when = 3"

    cur.execute(morningKcal_sql, (id, date))
    morning_kcal = cur.fetchone()[0] or 0

    cur.execute(lunchKcal_sql, (id, date))
    lunch_kcal = cur.fetchone()[0] or 0

    cur.execute(dinnerKcal_sql, (id, date))
    dinner_kcal = cur.fetchone()[0] or 0
    
    user_weight_sql = "SELECT weight, goal_weight FROM USER WHERE id = %s"
    cur.execute(user_weight_sql, (id,))
    user_weight = cur.fetchone()

    return {
        "name": helpbar_name,
        "total_calories": morning_kcal + lunch_kcal + dinner_kcal,
        "basal_meta": helpbar_meta,
        "calories_per_meal": {
            "breakfast": morning_kcal,
            "lunch": lunch_kcal,
            "dinner": dinner_kcal
        },
        "user_weight" : user_weight[0],
        "user_goal_weight" : user_weight[1]
    }



#플래너
#get
#증량감량유지 계산 : 몸무게, 목표 몸무게
#헬프바 : 사용자이름, 오늘 총 섭취 칼로리, 기초대사량, 아점저 섭취 칼로리
#기록 : 아점저 별로 먹은 음식이름, 칼로리, 탄단지
#post
#먹은 날짜랑 시간, 음식이름, 칼로리, 탄단지



@user_bp.route('/planner',  methods=['GET', 'POST'])
def planner():
    
    if request.method == 'GET':
        id = request.args.get('id')
        date = request.args.get('date')

        if not id or not date:
            return jsonify({"error": "Missing id or date"}), 400
        
        helpbar_data = get_helpbar_info(id, date)
    
        meals_sql = """
        SELECT meal_when, date, food_name, food_carbo, food_protein, food_fat, food_kcal
        FROM PLANNER
        WHERE id = %s AND date = %s
        ORDER BY meal_when
        """
        cur = db.cursor()
        cur.execute(meals_sql, (id, date))
        meals = cur.fetchall()
    
        meals_data = []
        for meal in meals:
            meals_data.append({
                "meal_when": meal[0],
                "date": meal[1].strftime('%Y-%m-%d'),
                "food_name": meal[2],
                "food_carbo": meal[3],
                "food_protein": meal[4],
                "food_fat": meal[5],
                "food_kcal": meal[6]
            })
    
    #meals_data 라는 리스트 안에 순서대로 아점저(정수형태), 날짜(yyyy--mm-dd), 음식이름, 탄수,단백,지방,음식칼로리 들어있고
    #이걸 meals라는 변수에 넣어서 저장
    
        return jsonify({
            "helpbar_info": helpbar_data,
            "meals": meals_data 
        })    
    
    
        
    elif request.method =='POST':
        
        data = request.json
        
        date = data.get('date')  # 먹은 날짜 (예: "2023-11-24")
        meal_when = data.get('meal_when')  # 식사 시간 (아침: 1, 점심: 2, 저녁: 3)
        food_name = data.get('food_name') # 음식 이름 
        food_kcal = data.get('food_kcal')  # 해당 끼니 칼로리
        food_carbo = data.get('food_carbo')  # 탄수화물
        food_protein = data.get('food_protein')  # 단백질
        food_fat = data.get('food_fat')  # 지방
        
        cursor = db.cursor()
        
        sql = """
        INSERT INTO PLANNER 
        (date, meal_when, food_name, food_kcal, food_carbo, food_protein, food_fat)
        VALUES
        (%s ,%s, %s, %s, %s, %s, %s)
        """

        
        cursor.execute(sql, (date, int(meal_when), food_kcal, food_carbo, food_protein, food_fat))
        db.commit()
        
        return jsonify({"success": "Planner saved successfully"}), 200
    
    


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

# 버려진 마이페이지
#@user_bp.route('/mypage', methods = ['POST'] )
#def mypage():
    user_id = session.get('user_id')
    
    
    if not user_id :
        return jsonify({'error': 'User not logged in'}), 401
    
    cursor = db.cursor()
    
    sql = """"
    SELECT name, age, weight, height, gender, excercise, goal_weight FROM USER
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
