from flask import request, jsonify
from datetime import datetime, timedelta
from models import db, User, Portfolio, Transaction, Trade
import yfinance as yf

def get_account_summary():
    try:
        # Mock data for now - this would normally come from the database
        return jsonify({
            'totalPortfolioValue': 1505.00,
            'availableCash': 10000.00,
            'totalReturn': 105.00,
            'dayGain': 10.30,
            'dayGainPercent': 0.68
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
        return jsonify(stock_info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_user():
    username = request.args.get('username')

    if not username:
        return jsonify({'error':'Username is required'}), 400
    
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'error':'User not found'}), 404
    
    user_data = {
        'username' : user.username,
        'portfolios' : [{
            'balance' : portfolio.balance,
            'last_accessed' : portfolio.last_accessed,
            'transactions' : [{
                'ticker' : transaction.ticker,
                'date' : transaction.date,
                'type' : transaction.trans_type,
                'amount' : transaction.amount
            }for transaction in portfolio.transactions]
        }for portfolio in user.portfolios]
    }
    return jsonify(user_data)

    
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
    
def execute_trade():
    data = request.json
    trade = Trade(
        symbol=data['symbol'],
        shares=data['shares'],
        price=data['price'],
        order_type=data['orderType'],
        total_amount=data['totalAmount'],
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        user_id=data['userId']
    )
    db.session.add(trade)
    db.session.commit()
    return jsonify({"success": True})

def get_trade_history():
    user_id = request.args.get('userId')
    trades = Trade.query.filter_by(user_id=user_id).order_by(Trade.date.desc()).all()
    return jsonify([{
        'symbol': t.symbol,
        'shares': t.shares,
        'price': t.price,
        'orderType': t.order_type,
        'totalAmount': t.total_amount,
        'date': t.date.strftime('%Y-%m-%d')
    } for t in trades])

def portfolio():
    return