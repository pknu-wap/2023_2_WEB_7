from bs4 
from flask import Flask, jsonify, request
from datetime import datetime, timedelta
from db_connector import db
app = Flask(__name__)

# ---------------------------------------------------------

# 몸무게 저장하는 함수, 리포트 페이지


def update_user_weight(id, date, user_weight):
    cur = db.cursor()

    user_weight_sql = "INSERT INTO REPORT (id, date, weight) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE weight = %s"
    cur.execute(user_weight_sql, (id, date, user_weight, user_weight))

    db.commit()

# ---------------------------------------------------------

# 날짜 계산, 주간 일자, 월별 일자 반환.


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


# ---------------------------------------------------------

# 일간 리포트
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

# ---------------------------------------------------------

# 주, 월별 리포트 반환
# 당일 하루 날짜를 넣으면 그 해에 해당하는 주, 월별 기간에 대한 (이름, 기간, 섭취 칼로리 등) 정보를 반환
# 입력한 날짜 당해의 기간에 대한 모든 데이터를 json으로 반환,


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

    return week_month_report  # 어떻게 주차, 월별 데이터 반환할지 로직 필요.

# 일, 주, 월별 리포트 반환
@app.route('/report', methods=['GET'])
def report():
    id = request.args.get('id')
    date = request.args.get('date')  # 'YYYY-MM-DD' 형식

    if not id or not date:
        return jsonify({"error": "Missing id or date parameter."}), 400

    daily_report = get_daily_report(id, date)
    monthly_ranges, weekly_ranges = get_monthly_weekly_ranges(date)
    monthly_reports = [get_week_month_report(
        id, *month_range) for month_range in monthly_ranges]
    weekly_reports = [get_week_month_report(
        id, *week_range) for week_range in weekly_ranges]

    return jsonify({
        "daily_report": daily_report,
        "all_monthly_reports": monthly_reports,
        "all_weekly_reports": weekly_reports
    })


# 몸무게 받아와서 저장
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
