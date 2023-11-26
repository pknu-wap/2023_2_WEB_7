from bs4
from flask import Flask
from datetime
from db_connector import db
app = Flask(__name__)

# 플래너에 각 인자에 해당하는 정보 저장


def save_planner(id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal):
    cur = db.cursor()

    save_planner_sql = """
        INSERT INTO PLANNER (id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cur.execute(save_planner_sql, (id, date, meal_when, food_name,
                food_carbo, food_protein, food_fat, food_kcal))
    return None

# 인자를 넣으면 그에 해당하는 데이터 삭제


def delete_planner(id, date, meal_when, food_name):
    cur = db.cursor()

    delete_planner_sql = """
        DELETE FROM PLANNER
        WHERE id = %s AND date = %s AND meal_when = %s AND food_name = %s
    """
    cur.execute(delete_planner_sql, (id, date, meal_when, food_name))

    return None

# action (save or delete), 에 대한 정보를 받아오면 그에 맞게 save_planner, delete_planner함수를 실행


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
        save_food = save_planner(
            id, date, meal_when, food_name, food_carbo, food_protein, food_fat, food_kcal)
    elif (action == 'delete'):
        delete_planner(id, date, meal_when, food_name)
    else:
        return jsonify({"error": "Invalid action"}), 400

    return jsonify({"message": "Action fetched successfully"}), 200
    # return jsonify({
    #     "save_planner": save_food
    # })
