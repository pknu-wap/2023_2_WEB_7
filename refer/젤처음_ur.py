from flask import Flask, render_template, Blueprint, request, jsonify, session
from flask_bcrypt import Bcrypt
import secrets
import re  
from bs4 import BeautifulSoup
from db_connector import db
import requests
from datetime import datetime, timedelta



# Flask 앱 초기화 및 bcrypt 초기화
app = Flask(__name__)
bcrypt = Bcrypt(app)
 




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
    
    if not id or not pw or not name or not age or not height or not weight or not gender or not exercise or not goal_weight:
        return jsonify({"error": "Invalid user information"}), 400
    
    weight_decimal = weight - int(weight)
    if weight_decimal <= 0.2:
        weight = int(weight)
    elif 0.3 <= weight_decimal <= 0.7:
        weight = int(weight) + 0.5
    else:
        weight = int(weight) + 1

    # goal_weight 값 반올림 로직
    goal_weight_decimal = goal_weight - int(goal_weight)
    if goal_weight_decimal <= 0.2:
        goal_weight = int(goal_weight)
    elif 0.3 <= weight_decimal <= 0.7:
        goal_weight = int(goal_weight) + 0.5
    else:
        goal_weight = int(goal_weight) + 1
    
    
    
    
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
    
    session.permanent = True
    session['user_id'] = id

    
    
    return jsonify({' result' : 'ok'})









# 로그인
@user_bp.route('/login', methods = ['POST'])
def login():
    data = request.json

    id = data.get('id')
    pw = data.get('password')

    cursor = db.cursor()
    sql = """
        SELECT pw FROM USER
        WHERE id = %s
    """
    cursor.execute(sql, (id,))
    result = cursor.fetchone()

    if result and bcrypt.check_password_hash(result[0], pw):
        session.permanent = True
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
    WHERE id = %s
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


def get_helpbar_info(user_id, date):
    cur = db.cursor()

    helpbar_name_sql = "SELECT name FROM USER WHERE id = %s"
    cur.execute(helpbar_name_sql, (user_id,))
    helpbar_name = cur.fetchone()

    helpbar_meta_sql = "SELECT active_meta FROM MYPAGE WHERE id = %s"
    cur.execute(helpbar_meta_sql, (user_id,))
    helpbar_meta = cur.fetchone()

    morningKcal_sql = "SELECT SUM(food_kcal) AS Morkcal FROM PLANNER WHERE id = %s AND date = %s AND meal_when = 1"
    lunchKcal_sql = "SELECT SUM(food_kcal) AS Lunkcal FROM PLANNER WHERE id = %s AND date = %s AND meal_when = 2"
    dinnerKcal_sql = "SELECT SUM(food_kcal) AS Dinkcal FROM PLANNER WHERE id = %s AND date = %s AND meal_when = 3"

    cur.execute(morningKcal_sql, (user_id, date))
    morning_kcal = cur.fetchone()[0] or 0

    cur.execute(lunchKcal_sql, (user_id, date))
    lunch_kcal = cur.fetchone()[0] or 0

    cur.execute(dinnerKcal_sql, (user_id, date))
    dinner_kcal = cur.fetchone()[0] or 0

    user_weight_sql = "SELECT weight, goal_weight FROM USER WHERE id = %s"
    cur.execute(user_weight_sql, (user_id,))
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
        "user_weight": user_weight[0],
        "user_goal_weight": user_weight[1]
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
    
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401
    
    
    if request.method == 'GET':
        
        current_date = datetime.now().strftime('%Y-%m-%d')
        helpbar_data = get_helpbar_info(user_id, current_date)
        

        
    
        meals_sql = """
        SELECT meal_when, date, food_name, food_carbo, food_protein, food_fat, food_kcal
        FROM PLANNER
        WHERE id = %s 
        ORDER BY date, meal_when
        """
        cur = db.cursor()
        cur.execute(meals_sql, (user_id, ))
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

        
        cursor.execute(sql, (date, int(meal_when), food_name, food_kcal, food_carbo, food_protein, food_fat))
        db.commit()
        
        return jsonify({"success": "Planner saved successfully"}), 200
    
    

# -------------------------------------------------------------------------------------------------------------------------------

# 레시피

# 레시피 검색 함수

def food_info(name):  # 음식 이름을 매개변수로 받음.
    food_list = []

    # 입력된 음식 이름을 사용해서 해당 레시피 사이트에 검색하는 url 생성
    url = f"https://www.10000recipe.com/recipe/list.html?q={name}&order=reco&page=1"

    response = requests.get(url)  # url로 get 요청

    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

        recommend_boxes = soup.find('ul', class_='tag_cont')
        food_rec_list = [a.text for a in recommend_boxes.find_all('a')]
        food_list.append(food_rec_list)

        food_boxes = soup.find_all(attrs={'class': 'common_sp_list_li'})
        food_item_list = []

        for list in food_boxes:
            food_img = list.find('img')['src']
            food_name = list.find(
                attrs={'class': 'common_sp_caption_tit'}).text

            food_link = list.find('a', class_="common_sp_link")
            href = food_link.get('href')
            food_number = href.split('/recipe/')[1]

            food_item = {'food_img': food_img,
                         'food_name': food_name, 'food_number': food_number}
            food_item_list.append(food_item)

        food_list.append(food_item_list)

    else:
        return {"error": f"HTTP response error: {response.status_code}"}

    return {"recommendations": food_list[0], "foods": food_list[1]}


# 레시피 내용 함수
def recipe_info(number):
    # 입력된 음식 이름을 사용해서 해당 레시피 사이트에 검색하는 url 생성
    url = f"https: //www.10000recipe.com/recipe/{number}"
    response = requests.get(url)  # url로 get요청

    # 200(성공)이면 html파싱, 그렇지 않으면 오류메시지 출력
    # 파싱 : 주어진 데이터를 분석해서 원하는 정보 추출
    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
    else:
        print("HTTP response error :", response.status_code)
        return

    # 레시피 부가 설명 추출
    recipe_intro = soup.find('div', id="recipeIntro")
    intro = list(recipe_intro.stripped_strings)

    # 레시피 정보 추출
    parent_tag = soup.find(class_="view2_summary_info")
    child_tags = parent_tag.find_all('span')
    info_side = [tag.get_text() for tag in child_tags]  # 양, 소요시간, 난이도 정보

    food_info = soup.find(attrs={'type': 'application/ld+json'})
    result = json.loads(food_info.text)
    name = result['name']  # 레시피 이름
    ingredient = ','.join(result['recipeIngredient'])  # 레시피에 필요한 재료

    # 레시피
    recipe = [result['recipeInstructions'][i]['text']
              for i in range(len(result['recipeInstructions']))]
    for i in range(len(recipe)):
        recipe[i] = f'{i+1}. ' + recipe[i]

    # 레시피 사진
    recipe_img = [result['recipeInstructions'][i]['image']
                  for i in range(len(result['recipeInstructions']))]

    res = {
        'name': name,
        'ingredients': ingredient,
        'recipe': recipe,
        'recipe_img': recipe_img,
        'recipe_intro': intro,
        'info_side': info_side,
    }

    return res





# 레시피 검색
@user_bp.route('/search/<string:food_name>', methods=['GET'])
def search_food_helpbar_info(food_name):
    
    search_data = food_info(food_name)

    user_id = session.get('user_id')
    current_date = datetime.now().strftime('%Y-%m-%d')

    helpbar_data = None
    if user_id:
        helpbar_data = get_helpbar_info(user_id, current_date)

    return jsonify({
        "search_info": search_data,
        "helpbar_info": helpbar_data
    })


# 레시피 내용
@user_bp.route('/recipe/<int:number>', methods=['GET'])
def get_recipe_helpbar_info():
    number = request.args.get(number)
    recipe_data = recipe_info(number)

    user_id = session.get('user_id')
    current_date = datetime.now().strftime('%Y-%m-%d')

    helpbar_data = None
    if user_id :
        helpbar_data = get_helpbar_info(user_id, current_date)

    return jsonify({
        "recipe_info": recipe_data,
        "helpbar_info": helpbar_data
    })



# 리포트


# 몸무게 저장
def update_user_weight(user_id, date, user_weight):
    cur = db.cursor()

    user_weight_sql = "INSERT INTO REPORT (id, date, weight) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE weight = %s"
    cur.execute(user_weight_sql, (user_id, date, user_weight, user_weight))

    db.commit()

# ------


# 받은 날짜 기준으로 당해 년도 모든 주의 시작, 끝 / 모든 월의 시작, 끝을 반환
# 즉 하루(당일 날짜) 보내주면 그해 년도꺼 계산
def get_week_range(date):
    date = datetime.strptime(date, '%Y-%m-%d')
    start_week = date - timedelta(days=date.weekday())
    end_week = start_week + timedelta(days=6)
    return start_week.strftime('%Y-%m-%d'), end_week.strftime('%Y-%m-%d')


def get_month_range(date):
    date = datetime.strptime(date, '%Y-%m-%d')
    start_month = date.replace(day=1)
    end_month = date.replace(day=1) + timedelta(days=31)
    end_month = end_month.replace(day=1) - timedelta(days=1)
    return start_month.strftime('%Y-%m-%d'), end_month.strftime('%Y-%m-%d')


def get_monthly_weekly_ranges(date):
    year = date.year
    months = [datetime(year, month, 1) for month in range(1, 13)]
    monthly_ranges = [(m.strftime('%Y-%m-%d'), (m.replace(day=1) +
                       timedelta(days=31)).replace(day=1) - timedelta(days=1)) for m in months]
    weekly_ranges = [get_week_range(m[0]) for m in monthly_ranges]
    return monthly_ranges, weekly_ranges


# ----------------------------------------------------------------------------------------------------------



# 일간 리포트 내용반환하는 함수
def get_daily_report(user_id, date):
    cur = db.cursor()

    nutri_daily_sql = """
        SELECT SUM(food_carbo) AS carbs, SUM(food_protein) AS protein, 
        SUM(food_fat) AS fat, SUM(food_kcal) AS calories 
        FROM PLANNER
        WHERE id = %s AND date = %s
    """
    cur.execute(nutri_daily_sql, (user_id, date))
    daily_data = cur.fetchone()

    name_meta_sql = """
        SELECT name, active_meta
        FROM USER
        JOIN MYPAGE ON USER.id = MYPAGE.id
        WHERE USER.id = %s
    """
    cur.execute(name_meta_sql, (user_id,))
    user_data = cur.fetchone()

    current_weight_sql = """
        SELECT weight
        FROM REPORT
        WHERE id = %s AND date = %s
    """
    cur.execute(current_weight_sql, (user_id,))
    current_data = cur.fetchone()

    db.commit()

    daily_report = {
        "name": user_data[0],
        "date": date,
        "intake_carbo": daily_data[0],
        "intake_protein": daily_data[1],
        "intake_fat": daily_data[2],
        "intake_kcal": daily_data[3],
        "basal_kcal": user_data[1],
        "current_weight": current_data  # 현재 몸무게 반환
    }
    return daily_report


# 각 주, 월에 해당하는 시작, 끝일을 인자로 받아서 각 데이터를 반환하는 함수
# 따라서 라우트쪽에서 시작 끝일 계산하는 함수를 사용해 모든 주와 모든 월의 시작 끝일을 반환한 후
# 아래의 함수에 일일이 대입해 이름, 섭취 칼로리 등의 데이터를 반환한다.
# 받는 데이터의 양이 많지 않을까 우려,,
def get_week_month_report(user_id, start_date, end_date):
    cur = db.cursor()

    nutri_WM_sql = """
        SELECT SUM(food_carbo) AS carbs, SUM(food_protein) AS protein, 
        SUM(food_fat) AS fat, SUM(food_kcal) AS calories
        FROM PLANNER
        WHERE id = %s AND date BETWEEN %s AND %s
    """
    cur.execute(nutri_WM_sql, (user_id, start_date, end_date))
    WM_data = cur.fetchone()

    WM_weight_sql = """
        SELECT weight
        FROM REPORT
        WHERE id = %s AND date = %s
    """
    cur.execute(WM_weight_sql, (user_id,  end_date))
    weight_data = cur.fetchone()

    name_meta_weight_sql = """
        SELECT name, active_meta, goal_weight
        FROM USER
        JOIN MYPAGE ON USER.id = MYPAGE.id
        WHERE USER.id = %s
    """
    cur.execute(name_meta_weight_sql, (user_id,))
    user_data = cur.fetchone()

    week_month_report = {
        "name": user_data[0],
        "range": start_date + "-" + end_date,
        "intake_carbo": WM_data[0],
        "intake_protein": WM_data[1],
        "intake_fat": WM_data[2],
        "intake_kcal": WM_data[3],
        "basal_kcal": user_data[1],
        "recent_weight": weight_data,  # 각 주 혹 각 월의 마지막날에 해당하는 몸무게
        "goal_weight": user_data[2]
    }

    return week_month_report


# 일, 주, 월간 리포트 필요한 데이터 반환
@user_bp.route('/report', methods=['GET'])
def report():
    user_id = session.get('user_id')
    date = request.args.get('date')  # 'YYYY-MM-DD' 형식

    if not user_id or not date:
        return jsonify({"error": "Missing id or date parameter."}), 400

    daily_report = get_daily_report(id, date)
    monthly_ranges, weekly_ranges = get_monthly_weekly_ranges(date)
    monthly_reports = [get_week_month_report(
        user_id, *month_range) for month_range in monthly_ranges]
    weekly_reports = [get_week_month_report(
        user_id, *week_range) for week_range in weekly_ranges]

    return jsonify({
        "daily_report": daily_report,
        "all_monthly_reports": monthly_reports,
        "all_weekly_reports": weekly_reports
    })


# user의 몸무게 저장
@user_bp.route('/report', methods=['POST'])
def save_user_weight():
    saving = request.json.get('save')
    if saving:
        user_id = session.get('user_id')
        user_weight = request.json.get('weight')

        if not user_id or user_weight is None:
            return jsonify({"error": "Missing id or weight"}), 400

        try:
            user_weight = float(user_weight)
        except ValueError:
            return jsonify({"error": "Invalid weight format"}), 400

        update_user_weight(user_id, user_weight)

        return jsonify({"message": "User weight updated successfully"}), 200
    else:
        return None



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
