from flask import Flask,render_template
import pymysql
from user_route import user_bp

app = Flask(__name__)

#blue print 등록, app.py에서 관리할 수 있도록 user 관련 라우터 당겨오기
app.register_blueprint(user_bp)

@app.route('/')
def home():
    return 'Welcome to the Home Page!'

@app.route('/test')
def test():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()