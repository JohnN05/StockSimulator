import routes
from flask import Flask
from flask_cors import CORS
from models import db

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db.init_app(app)

app.add_url_rule('/search', view_func=routes.search)



# Import routes after app is created
from routes import *

if __name__ == '__main__':
    app.run(debug=True)