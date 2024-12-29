import routes
from flask import Flask
from flask_cors import CORS
from models import db

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

db.init_app(app)

app.add_url_rule('/search', view_func=routes.search)
app.add_url_rule('/user', view_func=routes.get_user)
app.add_url_rule('/user/create', view_func=routes.create_user, methods=['GET','POST'])

from routes import *

if __name__ == '__main__':
    app.run(debug=True)