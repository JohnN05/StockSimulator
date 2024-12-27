from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Import routes after app is created
from routes import *

if __name__ == '__main__':
    app.run(debug=True)
