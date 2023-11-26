from bs4 
from flask import Flask, jsonify, request
from datetime
from db_connector import db
app = Flask(__name__)


def get_user_info(id):
    cur = db.cursor()

    user_info_sql = "SELECT name, age, weight, height, gender, exercise, goal_weight FROM USER WHERE id = %s"
    cur.execute(user_info_sql, (id,))
    user_info = cur.fetchone()

    if user_info:
        name, age, weight, height, gender, exercise, goal_weight = user_info
        # mypage 계산 안되면 바로 파이썬 코드에서 선언
        basal_meta_sql = "SELECT active_meta FROM MYPAGE WHERE id = %s"
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

# 마이페이지, 유저 정보 반환


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
