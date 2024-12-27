from app import app
from datetime import datetime
from flask import jsonify, request
import pandas as pd
import yfinance as yf

@app.route("/search")
def search():
    ticker_symbol = request.args.get('ticker')
    date = request.args.get('date') #expected format is YYYY-MM-DD
    
    if not ticker_symbol:
        return jsonify({"error":"Ticker parameter is required"}), 400
    elif not date:
        date = datetime.today().strftime('%Y-%m-%d')
    
    try:
        ticker = yf.Ticker(ticker_symbol)
        data = ticker.history(start=date, end=date)

        if data.empty:
            return jsonify({"error":"No ticker data found"}), 400
        
        stock_info = data.iloc[0].to_dict()
        stock_info["Date"] = date
        return jsonify(stock_info)
    except Exception as e:
        return jsonify({"error":str(e)}), 500