from flask import Flask, session, render_template, redirect, request, url_for
import mysql.connector

app = Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'SKAWNGUR12!'
app.config['MYSQL_DB'] = ' myloss'
app.config['MYSQL_HOST'] = 'localhost'
app.secret_key = "ABCDEFG"

mysql = mysql.connector.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    database=app.config['MYSQL_DB']
)

@app.route('/', methods=['GET', 'POST'])
def main():
    error = None

    if request.method == 'POST':
        id = request.form['id']
        pw = request.form['pw']

        cursor = mysql.cursor(dictionary=True)
        sql = "SELECT id FROM users WHERE id = %s AND pw = %s"
        value = (id, pw)
        cursor.execute("SET NAMES utf8")
        cursor.execute(sql, value)

        data = cursor.fetchall()
        cursor.close()

        for row in data:
            data = row['id']

        if data:
            session['login_user'] = id
            return redirect(url_for('home'))
        else:
            error = 'invalid input data detected !'
    return render_template('main.html', error=error)

@app.route('/register.html', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        id = request.form['regi_id']
        pw = request.form['regi_pw']

        cursor = mysql.cursor()

        sql = "INSERT INTO users VALUES (%s, %s)"
        value = (id, pw)
        cursor.execute(sql, value)

        mysql.commit()
        cursor.close()
        return redirect(url_for('main'))

    return render_template('register.html', error=error)

@app.route('/home.html', methods=['GET', 'POST'])
def home():
    error = None
    id = session['login_user']
    return render_template('home.html', error=error, name=id)

if __name__ == '__main__':
    app.run()
