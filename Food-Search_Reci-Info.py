import requests
import json
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request, redirect
from datetime import datetime, timedelta

import pymysql

app = Flask(__name__)


##-----------------------데이터베이스-------------------------

db = pymysql.connect(host='3.112.14.157', 
                        user='root', 
                        password='123qwe!', 
                        db = 'EAT_PLAYLIST2',
                        port = 3306,
                        charset='utf8')

##-----------------------데이터베이스-------------------------

##로그인 파트
weight_decimal = weight - int(weight)
if  weight_decimal <= 0.2:
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
    INSERT INTO user
    (id, pw, name, age, height, weight , gender, excercise, goal_weight, created_time)
    VALUES
    (%s, %s, %s, %s, %s, %s, %s, %s, %s, SYSDATE())
"""

cursor.execute(sql, (id, hashed_pw, name, age, int(height), int(weight), gender, int(excercise), int(goal_weight), excercise, )) 
db.commit()

## 회원정보 수정 logic "alter 구문!!"
## sysdate 양식?? 상관 없긴하다 -> only use in user table이기에


#----------------------------------------------------------------



def food_info(name):  # 음식 이름을 매개변수로 받음.
    food_list = []

    # 입력된 음식 이름을 사용해서 해당 레시피 사이트에 검색하는 url 생성
    url = f"https: //www.10000recipe.com/recipe/list.html?q={name}&order=reco&page=1"
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

            food_item = {'food_img': food_img,'food_name': food_name, 'food_number': food_number}
            food_item_list.append(food_item)

        food_list.append(food_item_list)

    else:
        return {"error": f"HTTP response error: {response.status_code}"}

    return {"recommendations": food_list[0], "foods": food_list[1]}


##---------------------------------------------------------------------------

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
    recipe_img = [result['recipeInstructions'][i]['image'] for i in range(len(result['recipeInstructions']))]

    res = {
        'name': name,
        'ingredients': ingredient,
        'recipe': recipe,
        'recipe_img': recipe_img,
        'recipe_intro': intro,
        'info_side': info_side,
    }

    return res

#------------------------------------------------------------


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


#------------------------------------------------------------

def get_user_info(id):
    cur = db.cursor()

    user_info_sql = "SELECT name, age, weight, height, gender, exercise, goal_weight FROM USER WHERE id = %s"
    cur.execute(user_info_sql, (id,))
    user_info = cur.fetchone()

    if user_info:
        name, age, weight, height, gender, exercise, goal_weight = user_info
        basal_meta_sql = "SELECT active_meta FROM MYPAGE WHERE id = %s" ## mypage 계산 안되면 바로 파이썬 코드에서 선언
        cur.execute(basal_meta_sql, (id,))
        basal_meta_result = cur.fetchone()
        basal_meta = basal_meta_result[0] if basal_meta_result else None

        return {
            "name": name,
            "age": age,
            "weight": weight,
            "height": height,
            "gender": gender,
            "exercise": exercise,
            "basal_meta": basal_meta,
            "goal_weight": goal_weight
        }
    else:
        return None
    
#------------------------------------------------------------

def update_user_weight(id, date, user_weight): 
    cur = db.cursor()
    
    user_weight_sql = "INSERT INTO REPORT (id, date, weight) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE weight = %s"
    cur.execute(user_weight_sql, (id, date, user_weight, user_weight))

    db.commit()

#------------------------------------------------------------

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
    monthly_ranges = [(m.strftime('%Y-%m-%d'), (m.replace(day=1) + timedelta(days=31)).replace(day=1) - timedelta(days=1)) for m in months]
    weekly_ranges = [get_week_range(m[0]) for m in monthly_ranges]
    return monthly_ranges, weekly_ranges


#------------------------------------------------------------

def get_daily_report(id, date):
    cur = db.cursor()

    nutri_daily_sql = """
        SELECT SUM(food_carbo) AS carbs, SUM(food_protein) AS protein, 
        SUM(food_fat) AS fat, SUM(food_kcal) AS calories 
        FROM PLANNER
        WHERE id = %s AND date = %s
    """
    cur.execute(nutri_daily_sql, (id, date))
    daily_data = cur.fetchone()

    name_meta_sql = """
        SELECT name, active_meta
        FROM USER
        JOIN MYPAGE ON USER.id = MYPAGE.id
        WHERE USER.id = %s
    """
    cur.execute(name_meta_sql, (id,))
    user_data = cur.fetchone()

    current_weight_sql = """
        SELECT weight
        FROM REPORT
        WHERE id = %s AND date = %s
    """
    cur.execute(current_weight_sql, (id,))
    current_data = cur.fetchone()

    daily_report = {
        "name": user_data[0],
        "date": date,
        "intake_carbo": daily_data[0],
        "intake_protein": daily_data[1],
        "intake_fat": daily_data[2],
        "intake_kcal": daily_data[3],
        "basal_kcal": user_data[1],
        "current_weight": current_data
    }
    return daily_report


def get_week_month_report(id, start_date, end_date):
    cur = db.cursor()
    
    nutri_WM_sql = """
        SELECT SUM(food_carbo) AS carbs, SUM(food_protein) AS protein, 
        SUM(food_fat) AS fat, SUM(food_kcal) AS calories
        FROM PLANNER
        WHERE id = %s AND date BETWEEN %s AND %s
    """
    cur.execute(nutri_WM_sql, (id, start_date, end_date))
    WM_data = cur.fetchone()


    WM_weight_sql = """
        SELECT weight
        FROM REPORT
        WHERE id = %s AND date = %s
    """
    cur.execute(WM_weight_sql, (id,  end_date))
    weight_data = cur.fetchone()


    name_meta_weight_sql = """
        SELECT name, active_meta, goal_weight
        FROM USER
        JOIN MYPAGE ON USER.id = MYPAGE.id
        WHERE USER.id = %s
    """
    cur.execute(name_meta_weight_sql, (id,))
    user_data = cur.fetchone()
    

    week_month_report = {
        "name": user_data[0],
        "range": start_date + "-" + end_date,
        "intake_carbo": WM_data[0],
        "intake_protein": WM_data[1],
        "intake_fat": WM_data[2],
        "intake_kcal": WM_data[3],
        "basal_kcal": user_data[1],
        "recent_weight": weight_data,
        "goal_weight": user_data[2]
    }

    return week_month_report ## 어떻게 주차, 월별 데이터 반환할지 로직 필요.



def save_planner(id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal):
    cur = db.cursor()

    save_planner_sql = """
        INSERT INTO PLANNER (id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(save_planner_sql, (id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal))
    # save_planner_data = cur.fetchone()

    # save_planner_data = {
    #     "date" : save_planner_data[0],
    #     "meal_when" : save_planner_data[1],
    #     "food_name" : save_planner_data[2],
    #     "food_carbo" : save_planner_data[3],
    #     "food_protein" : save_planner_data[4],
    #     "food_fat" : save_planner_data[5],
    #     "food_kcal" : save_planner_data[6]
    # }

    # return save_planner_data
    return None
    
## 플래너에 추가하지 않고, 조회하면 오류뜰려나,,



def delete_planner(id, date, meal_when, food_name):
    cur = db.cursor()

    delete_planner_sql = """
        DELETE FROM PLANNER
        WHERE id = %s AND date = %s AND meal_when = %s AND food_name = %s
    """
    cur.execute(delete_planner_sql,(id, date, meal_when, food_name))

    return None


##---------------------------------------------------------------------------

@app.route('/search/<string:food_name>', methods=['GET'])
def search_food_helpbar_info(food_name):
    food_name = request.args.get('food_name')
    search_data = food_info(food_name)

    id = request.json.get('id')
    date = request.json.get('date')

    helpbar_data = None
    if id and date:
        helpbar_data = get_helpbar_info(id, date)

    return jsonify({
        "search_info": search_data,
        "helpbar_info": helpbar_data
    })


@app.route('/recipe/<int:number>', methods=['GET'])
def get_recipe_helpbar_info():
    number = request.args.get(number)
    recipe_data = recipe_info(number)

    id = request.json.get('id')
    date = request.json.get('date')

    helpbar_data = None
    if id and date:
        helpbar_data = get_helpbar_info(id, date)

    return jsonify({
        "recipe_info": recipe_data,
        "helpbar_info": helpbar_data
    })


@app.route('/refri/<string:food_name>', methods=['GET'])
def search_food():
    food_name = request.args.get('food_name') ## 애매모호.. 무러봐ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
    if food_name:
        return jsonify(food_info(food_name))
    else:
        return jsonify({"error": "Please enter a food name."}), 400
    


@app.route('/planner', methods=['POST'])
def save_food_planner():
    action = request.json.get('action')
    id = request.json.get('id')
    date = request.json.get('date')  
    meal_when = request.json.get('meal_when')
    food_name = request.json.get('food_name')
    food_carbo = request.json.get('food_carbo')
    food_protein = request.json.get('food_protein')
    food_fat = request.json.get('food_fat')
    food_kcal = request.json.get('food_kcal')

    if not id or not date or not meal_when or not food_name:
        return jsonify({"error": "Missing id, date or meal_when"}), 400
    
    if action == 'save':
        save_food = save_planner(id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal)
    elif (action =='delete'):
        delete_planner(id, date, meal_when, food_name)
    else:
        return jsonify({"error": "Invalid action"}), 400

    return jsonify({"message": "Action fetched successfully"}), 200
    # return jsonify({
    #     "save_planner": save_food
    # })

def helpbar_info():
    id = request.args.get('id')
    date = request.args.get('date')

    if not id or not date:
        return jsonify({"error": "Missing id or date"}), 400
        
    helpbar_data = get_helpbar_info(id, date)
    return jsonify({
        "helpbar_info": helpbar_data
    })

####################################################################
@app.route('/report', methods=['GET'])
def report():
    id = request.args.get('id')
    date = request.args.get('date')  # 'YYYY-MM-DD' 형식

    if not id or not date:
        return jsonify({"error": "Missing id or date parameter."}), 400

    daily_report = get_daily_report(id, date)
    monthly_ranges, weekly_ranges = get_monthly_weekly_ranges(date)
    monthly_reports = [get_week_month_report(id, *month_range) for month_range in monthly_ranges]
    weekly_reports = [get_week_month_report(id, *week_range) for week_range in weekly_ranges]

    return jsonify({
        "daily_report": daily_report,
        "all_monthly_reports": monthly_reports,
        "all_weekly_reports": weekly_reports
    })



@app.route('/report', methods=['POST'])
def save_user_weight():
    id = request.json.get('id')
    user_weight = request.json.get('weight')

    if not id or user_weight is None:
        return jsonify({"error": "Missing id or weight"}), 400

    try:
        user_weight = float(user_weight)
    except ValueError:
        return jsonify({"error": "Invalid weight format"}), 400
    
    update_user_weight(id, user_weight)

    return jsonify({"message": "User weight updated successfully"}), 200



@app.route('/mypage', methods=['GET'])
def mypage():
    id = request.json.get('id')
    if not id:
        return jsonify({"error": "Missing id parameter."}), 400

    user_info = get_user_info(id)
    if user_info:
        return jsonify(user_info)
    else:
        return jsonify({"error": "User not found."}), 404



# @app.route('/recipe') #search랑 같은디??
# def get_food_list():
#     query = request.args.get('q')
#     if query:
#         return jsonify(food_info())
#     else:
#         return jsonify({"error": "Missing 'q' parameter."}), 400

# @app.route('/')
# def index():
#     url = http://www.eatply.online
#     return redirect(url)