import requests
import json
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from datetime
from db_connector import db

app = Flask(__name__)

# 레시피 목록(검색시 나오는 것)


def food_info(name):  # 음식 이름을 매개변수로 받음.
    food_list = []

    # 입력된 음식 이름을 사용해서 해당 레시피 사이트에 검색하는 url 생성
    url = f"https: //www.10000recipe.com/recipe/list.html?q={
        name}&order=reco&page=1"
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


# ---------------------------------------------------------------------------

# 레시피 내용
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


# ---------------------------------------------------------------------------

# 헬프바, 헬프바에 필요한 데이터 포함, 몸무게/목표 몸무게 같이 반환
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
        "user_weight": user_weight[0],
        "user_goal_weight": user_weight[1]
    }


# 레시피 목록 라우트
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


# 레시피 내용 라우트
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

# 냉장고 페이지, 몰라서 그냥 레시피 목록이랑 같은 함수 삽입하였으나, 필요없으면 삭제


@app.route('/refri/<string:food_name>', methods=['GET'])
def search_food():
    # 애매모호.. 무러봐ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ
    food_name = request.args.get('food_name')
    if food_name:
        return jsonify(food_info(food_name))
    else:
        return jsonify({"error": "Please enter a food name."}), 400
