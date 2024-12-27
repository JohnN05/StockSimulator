from __main__ import app
from flask import request, jsonify
from datetime import datetime, timedelta
import yfinance as yf

@app.route("/search")
def search():
    ticker_symbol = request.args.get('ticker')
    date_str = request.args.get('date')  # expected format is YYYY-MM-DD

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