import routes
from flask import Flask, send_from_directory
from flask_cors import CORS
from models import db
import os

app = Flask(__name__, static_folder='../frontend/dist')
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

db.init_app(app)

# API Routes
app.add_url_rule('/api/search', view_func=routes.search)
app.add_url_rule('/api/user', view_func=routes.get_user)
app.add_url_rule('/api/user/create', view_func=routes.create_user, methods=['GET','POST'])
app.add_url_rule('/api/trade', view_func=routes.execute_trade, methods=['POST'])
app.add_url_rule('/api/history', view_func=routes.get_trade_history, methods=['GET'])
app.add_url_rule('/api/account/summary', view_func=routes.get_account_summary, methods=['GET'])

# Serve frontend static files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(port=5002, debug=True)