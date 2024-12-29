from flask import request, jsonify
from datetime import datetime, timedelta
from models import db, User, Portfolio, Transaction
import yfinance as yf

def search():
    ticker_symbol = request.args.get('ticker')
    date_str = request.args.get('date')  # expected format: YYYY-MM-DD

    if not ticker_symbol:
        return jsonify({"error": "Ticker parameter is required"}), 400

    if not date_str:
        date = datetime.today()
    else:
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Date must be in the format YYYY-MM-DD"}), 400
    end_date = date + timedelta(days=1)

    try:
        ticker = yf.Ticker(ticker_symbol)
        data = ticker.history(start=date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))

        if data.empty:
            return jsonify({"error": f"No data found for ticker {ticker_symbol} on date {date.strftime('%Y-%m-%d')}"}), 400

        stock_info = data.iloc[0].to_dict()
        stock_info["Date"] = date.strftime('%Y-%m-%d')
        return jsonify({"data": stock_info})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def create_user():
    username = request.args.get('username')
    password = request.args.get('password')

    if not username or not password:
        return jsonify({'error':'Username and password are required.'}), 400
    
    try:
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message':f'{username} has been successfully added.'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def portfolio():
    return