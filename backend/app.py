import routes
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.add_url_rule('/search', view_func=routes.search)

CORS(app)

if __name__ == '__main__':
    app.run(debug=True)