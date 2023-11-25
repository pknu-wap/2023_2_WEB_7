import pymysql

db = pymysql.connect(
    user = 'root',
    passwd =  '123qwe!',
    host = '3.112.14.157',
    db = 'EAT_PLAYLIST2',
    port = 3306,
    charset  = 'utf8'  
)