from datetime import datetime, timedelta
from flask import Flask, render_template, Blueprint, request, jsonify, session
from bs4 import BeautifulSoup
from flask_bcrypt import Bcrypt
import secrets
import json
import requests
from db_connector import db


# 1. 플래너에서 날짜 자동추가? 에바 -> 플래너 page 프론트에서 정보 보내주면 그대로 저장 -> YYYY-MM-DD
# 2. 리포트 양 많은데 어떻게?
# 3. 냉장고 페이지 따로 정의할거 있는지? -> NO

# Flask 앱 초기화 및 bcrypt 초기화
app = Flask(__name__)
bcrypt = Bcrypt(app)


app.secret_key = secrets.token_hex(24)


# 로컬호스트:포트번호/user/url_prefix에 적힌 값 적고
user_bp = Blueprint('user', __name__, url_prefix='/user')


# CORS(user_bp, origins=["http://www.eatply.online"])


# 회원가입
@user_bp.route('/join', methods=['POST'])
def signup():
    data = request.json
    id = data.get('id')
    pw = data.get('pw')
    name = data.get('name')
    age = data.get('age')
    height = data.get('height')
    weight = data.get('weight')
    gender = data.get('gender')
    exercise = data.get('excercise')
    goal_weight = data.get('goal_weight')

    if not id or not pw or not name or not age or not height or not weight or not gender or not exercise or not goal_weight:
        return jsonify({"error": "Invalid user information"}), 400
    save(id, pw, name, age, height, weight, gender, exercise, goal_weight)
    return jsonify({' result': 'ok'})


# 회원가입에 저장
def save(id, pw, name, age, height, weight, gender, exercise, goal_weight):

    weight_decimal = weight - int(weight)
    if weight_decimal <= 0.2:
        weight = int(weight)
    elif 0.3 <= weight_decimal <= 0.7:
        weight = int(weight) + 0.5
    else:
        weight = int(weight) + 1

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
    hashed_pw = bcrypt.generate_password_hash(pw).decode('utf-8')
    cursor.execute(sql, (id, hashed_pw, name, int(age), height,
                   weight, int(gender), int(exercise), goal_weight, ))
    db.commit()
    db.close()


# 로그인
@user_bp.route('/login', methods=['POST'])
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
        session['user_id'] = id
        return jsonify({'result': 'ok'})
    else:
        return jsonify({'result': 'fail'}), 401


# 로그아웃
@user_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify('Logged out')


# 마이페이지
@user_bp.route('/mypage', methods=['GET'])
def get_user_info():
    modify = request.args.get('action')
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    user_info = mypage(user_id)

    if modify == "modify":
        update_mypage(user_id)
        return jsonify({"message": "Successfully updated my_page"})

    return user_info


def mypage(user_id):
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


# id 제외 user 기본정보 수정
# id가 존재하면 수행, 아니면 오류
def update_mypage(user_id):
    data = request.json
    try:
        cursor = db.cursor()
        check_user_sql = "SELECT COUNT(*) FROM USER WHERE id = %s"
        cursor.execute(check_user_sql, (user_id,))
        user_exists = cursor.fetchone()[0]

        if user_exists == 0:
            return jsonify({'error': 'Unauthorized request - User ID not found'}), 401

        pw = data.get('pw')
        name = data.get('name')
        age = data.get('age')
        height = data.get('height')
        weight = data.get('weight')
        gender = data.get('gender')
        exercise = data.get('exercise')
        goal_weight = data.get('goal_weight')

        update_sql = """
            UPDATE USER
            SET pw = %s, name = %s, age = %s, height = %s, weight = %s, 
                gender = %s, exercise = %s, goal_weight = %s
            WHERE id = %s
        """
        cursor.execute(update_sql, (pw, name, age, height, weight,
                       gender, exercise, goal_weight, user_id))
        db.commit()
        return jsonify({'message': 'User information updated successfully'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': 'Database error: ' + str(e)}), 500


# ---------------------------------------------------------------------------


# 레시피 검색 함수
def food_info(name):  # 음식 이름을 매개변수로 받음.
    food_list = []

    # 입력된 음식 이름을 사용해서 해당 레시피 사이트에 검색하는 url 생성
    url = f"""https: //www.10000recipe.com/recipe/list.html?q={
        name}&order=reco&page=1"""
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


# 헬프바 함수. 레시피 검색, 레시피 내용에 사용
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


# 레시피 검색
@user_bp.route('/search/<string:food_name>', methods=['GET'])
def search_food_helpbar_info(food_name):
    food_name = request.args.get('food_name')
    search_data = food_info(food_name)

    user_id = session.get('user_id')
    current_date_time = datetime.now()
    formatted_date = current_date_time.strftime('%Y-%m-%d')

    helpbar_data = None
    if user_id:
        helpbar_data = get_helpbar_info(user_id, formatted_date)

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
    current_date_time = datetime.now()
    formatted_date = current_date_time.strftime('%Y-%m-%d')

    helpbar_data = None
    if user_id:
        helpbar_data = get_helpbar_info(user_id, formatted_date)

    return jsonify({
        "recipe_info": recipe_data,
        "helpbar_info": helpbar_data
    })

# ---------------------------------------------------------------------------

# 플래너
# get
# 증량감량유지 계산 : 몸무게, 목표 몸무게
# 헬프바 : 사용자이름, 오늘 총 섭취 칼로리, 기초대사량, 아점저 섭취 칼로리
# 기록 : 아점저 별로 먹은 음식이름, 칼로리, 탄단지
# post
# 먹은 날짜랑 시간, 음식이름, 칼로리, 탄단지


# planner에 저장 함수
def save_planner(user_id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal):
    cur = db.cursor()

    save_planner_sql = """
        INSERT INTO PLANNER (id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(save_planner_sql, (user_id, date, meal_when, food_name,
                food_carbo, food_protein, food_fat, food_kcal))

    return None


# planner에서 삭제 함수
def delete_planner(user_id, date, meal_when, food_name):
    cur = db.cursor()

    delete_planner_sql = """
        DELETE FROM PLANNER
        WHERE id = %s AND date = %s AND meal_when = %s AND food_name = %s
    """
    cur.execute(delete_planner_sql, (user_id, date, meal_when, food_name))

    return None


# planner에 몸무게 저장
def update_user_weight(user_id, date, user_weight):
    cur = db.cursor()

    user_weight_sql = "INSERT INTO REPORT (id, date, weight) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE weight = %s"
    cur.execute(user_weight_sql, (user_id, date, user_weight, user_weight))

    db.commit()


# 플래너 테이블의 내용 표기(get) 및, 저장/삭제 로직 (post)
@user_bp.route('/planner',  methods=['GET', 'POST'])
def planner():

    if request.method == 'GET':
        user_id = session.get('user_id')
        date = request.args.get('date')  # 얘는 받아온 날에 대한 정보를 반환해야되니, 유지

        if not user_id or not date:
            return jsonify({"error": "Missing id or date"}), 400

        meals_sql = """
        SELECT meal_when, date, food_name, food_carbo, food_protein, food_fat, food_kcal
        FROM PLANNER
        WHERE id = %s AND date = %s
        ORDER BY meal_when
        """
        cur = db.cursor()
        cur.execute(meals_sql, (user_id, date))
        meals = cur.fetchall()

        current_date_time = datetime.now()

        formatted_date = current_date_time.strftime('%Y-%m-%d')

        helpbar_data = get_helpbar_info(
            user_id, formatted_date)  # 오늘 날짜에 해당하는 helpbar 정보 반환

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

    # meals_data 라는 리스트 안에 순서대로 아점저(정수형태), 날짜(yyyy--mm-dd), 음식이름, 탄수,단백,지방,음식칼로리 들어있고
    # 이걸 meals라는 변수에 넣어서 저장

        return jsonify({
            "helpbar_info": helpbar_data,
            "meals": meals_data
        })

    elif request.method == 'POST':
        data = request.json
        action = data.get('action')
        user_id = session.get('user_id')

        if action == 'update_weight':
            user_weight = data.get('weight')
            if not user_weight:
                return jsonify({"error": "Missing weight"}), 400
            try:
                user_weight = float(user_weight)
            except ValueError:
                return jsonify({"error": "Invalid weight format"}), 400
            update_user_weight(user_id, user_weight)
            return jsonify({"message": "User weight updated successfully"}), 200

        date = data.get('date')  # 먹은 날짜 (예: "2023-11-24")
        meal_when = data.get('meal_when')  # 식사 시간 (아침: 1, 점심: 2, 저녁: 3)
        food_name = data.get('food_name')  # 음식 이름
        food_kcal = data.get('food_kcal')  # 해당 끼니 칼로리
        food_carbo = data.get('food_carbo')  # 탄수화물
        food_protein = data.get('food_protein')  # 단백질
        food_fat = data.get('food_fat')  # 지방
        if not date or not meal_when or not food_name:
            return jsonify({"error": "Missing date, meal_when or food_name"}), 400

        if action == 'save':
            save_planner(user_id, date, meal_when, food_name,
                         food_carbo, food_protein, food_fat, food_kcal)
        elif action == 'delete':
            delete_planner(user_id, date, meal_when, food_name)
        else:
            return jsonify({"error": "Invalid action"}), 400

        return jsonify({"message": "Action fetched successfully"}), 200


# ---------------------------------------------------------------------------
# 리포트


# ------
def get_four_weekly_ranges(date):
    # 해당 월의 첫째 날과 마지막 날 계산
    start_of_month = date.replace(day=1)
    end_of_month = start_of_month + timedelta(days=31)
    end_of_month = end_of_month.replace(day=1) - timedelta(days=1)

    # 4주간의 시작과 끝 날짜 계산
    weekly_ranges = [
        (start_of_month, start_of_month + timedelta(days=6)),
        (start_of_month + timedelta(days=7), start_of_month + timedelta(days=13)),
        (start_of_month + timedelta(days=14), start_of_month + timedelta(days=20)),
        (start_of_month + timedelta(days=21), end_of_month)
    ]

    return weekly_ranges


def get_previous_months(date, months=2):
    # 이전 몇 개월(기본값 2)을 계산
    monthly_ranges = []
    for i in range(months + 1):
        month = (date.month - i - 1) % 12 + 1
        year = date.year if (date.month - i - 1) >= 0 else date.year - 1
        monthly_ranges.append(datetime(year, month, 1))
    return monthly_ranges


# -------
# 일간 리포트 내용반환하는 함수
def get_daily_report(user_id, date):
    with db.cursor() as cur:
        nutri_daily_sql = """
            SELECT SUM(food_carbo) AS carbs, SUM(food_protein) AS protein, 
            SUM(food_fat) AS fat, SUM(food_kcal) AS calories 
            FROM PLANNER
            WHERE id = %s AND date = %s
        """
        cur.execute(nutri_daily_sql, (user_id, date))
        daily_data = cur.fetchone()

        current_weight_sql = """
            SELECT weight
            FROM REPORT
            WHERE id = %s AND date = %s
        """
        cur.execute(current_weight_sql, (user_id,))
        current_data = cur.fetchone()

        db.commit()

        daily_report = {
            "date": date,
            "intake_carbo": daily_data[0],
            "intake_protein": daily_data[1],
            "intake_fat": daily_data[2],
            "intake_kcal": daily_data[3],
            "current_weight": current_data  # date에 해당하는 몸무게 반환, 없으면 null
        }
    return daily_report


# 주 및 뭘 간 리포트 반환용 함수
def get_week_month_report(user_id, start_date, end_date):
    with db.cursor() as cur:
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

        # 마지막 날에 대한 정보가 입력되지 않았을 경우, 해당 기간 가장 마지막에 입력한 반환하도록 수정
        if not weight_data or weight_data[0] is None:
            recent_weight_sql = """
                SELECT weight FROM REPORT
                WHERE id = %s AND date BETWEEN %s AND %s
                ORDER BY date DESC
                LIMIT 1
            """
            cur.execute(recent_weight_sql, (user_id, start_date, end_date))
            weight_data = cur.fetchone()

        week_month_report = {
            "start_date": start_date,
            "end_date": end_date,
            "intake_carbo": WM_data[0],
            "intake_protein": WM_data[1],
            "intake_fat": WM_data[2],
            "intake_kcal": WM_data[3],
            "recent_weight": weight_data,  # 각 주/각 월의 마지막날에 해당하는 몸무게, 아니면 최근 몸무게
        }

    return week_month_report

# user의 이름, 기초대사량, 목표 몸무게 반환하도록 수정


def user_report(user_id):
    with db.cursor() as cur:
        user_data_sql = """
            SELECT name, active_meta, goal_weight
            FROM USER
            JOIN MYPAGE ON USER.id = MYPAGE.id
            WHERE USER.id = %s
        """
        cur.execute(user_data_sql, (user_id,))
        user_data = cur.fetchone()

        basal_goal = {
            "name": user_data[0],
            "basal_mata": user_data[1],
            "goal_weight": user_data[2]
        }

    return basal_goal


# 일, 주, 월간 리포트 필요한 데이터 반환
# 랜더링 될떄 표기할 user_id 미수정입니다
@user_bp.route('/report', methods=['GET'])
def report():
    user_id = session.get('user_id')
    date = datetime.now().strftime('%Y-%m-%d')  # 현재 날짜를 기준으로 리포트 갱신되도록 코드 수정

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    # 일간 리포트
    daily_reports = []
    for i in range(7):
        daily_date = date - timedelta(days=i)
        daily_report = get_daily_report(
            user_id, daily_date.strftime('%Y-%m-%d'))
        daily_reports.append(daily_report)

    # 주간 리포트
    weekly_ranges = get_four_weekly_ranges(date)
    weekly_reports = []
    for start_date, end_date in weekly_ranges:
        report = get_week_month_report(user_id, start_date.strftime(
            '%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        weekly_reports.append(report)

    # 월간 리포트
    previous_months = get_previous_months(date)
    monthly_reports = []
    for month_date in previous_months:
        start_month = month_date.strftime('%Y-%m-%d')
        end_month = (month_date + timedelta(days=31)
                     ).replace(day=1) - timedelta(days=1)
        end_month = end_month.strftime('%Y-%m-%d')
        report = get_week_month_report(user_id, start_month, end_month)
        monthly_reports.append(report)

    # 기초대사량, 몸무게 이름까지 따로 반환하도록 수정 - 한꺼번에 하도록 JOIN함
    user_Data = user_report(user_id)

    return jsonify({
        "daily_reports": daily_reports,
        "weekly_reports": weekly_reports,
        "monthly_reports": monthly_reports,
        "user_report": user_Data
    })


# -------------------------------------------------------
# 마이페이지
# def get_user_info(user_id):
#     cur = db.cursor()

#     user_info_sql = "SELECT name, age, weight, height, gender, exercise, goal_weight FROM USER WHERE id = %s"
#     cur.execute(user_info_sql, (user_id,))
#     user_info = cur.fetchone()

#     if user_info:
#         name, age, weight, height, gender, exercise, goal_weight = user_info
#         basal_meta_sql = "SELECT active_meta FROM MYPAGE WHERE id = %s"
#         cur.execute(basal_meta_sql, (user_id,))
#         basal_meta_result = cur.fetchone()
#         basal_meta = basal_meta_result[0] if basal_meta_result else None

#         return {
#             "name": name,
#             "age": age,
#             "weight": weight,
#             "height": height,
#             "gender": gender,
#             "exercise": exercise,
#             "basal_meta": basal_meta,
#             "goal_weight": goal_weight
#         }
#     else:
#         return None


# @user_bp.route('/mypage', methods=['GET'])
# def mypage():
#     user_id = session.get('user_id')
#     if not user_id:
#         return jsonify({"error": "User not logged in."}), 400

#     user_info = get_user_info(user_id)
#     if user_info:
#         return jsonify(user_info)
#     else:
#         return jsonify({"error": "User not found."}), 404

# -------------------------------------------------


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


def get_helpbar_info(user_id):
    with db.cursor() as cur:
        # HELPBAR 관련 정보를 데이터베이스에서 조회하는 쿼리
        # 예시: cursor.execute("SELECT * FROM HELPBAR WHERE id = %s", (user_id,))
        # 데이터를 가져오는 로직 구현
        pass
    # 결과를 반환
    return {"username": "example", "total_calories": 0, "basal_meta": 0, "calories_per_meal": {"breakfast": 0, "lunch": 0, "dinner": 0}}
