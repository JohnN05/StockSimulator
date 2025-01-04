from flask import request, jsonify
from datetime import datetime, timedelta

import numpy as np
from sqlalchemy import func, case
from models import db, User, Portfolio, Transaction
import utils
import yfinance as yf

DEFAULT_POINTS = 100

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
        return jsonify({"error": f"Failed to retrieve data for ticker {ticker_symbol}: {str(e)}"}), 500

def search():
    required_fields = ['ticker']
    error, status = utils.verify_fields(request.args, required_fields)
    if error:
        return jsonify(error), status
    
    ticker_symbol = request.args.get('ticker')
    date_str = request.args.get('date')  # expected format: YYYY-MM-DD
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
        return jsonify({"error": f"Failed to retrieve data for ticker {ticker_symbol}: {str(e)}"}), 500
    
def get_points(ticker_symbol):
    required_fields = ['start', 'end']
    error, status = utils.verify_fields(request.args, required_fields)
    if error:
        return jsonify(error), status
    
    try:
        start = datetime.strptime(request.args.get('start'), '%Y-%m-%d')
        end = datetime.strptime(request.args.get('end'), '%Y-%m-%d')
        if start >= end:
            return jsonify({'error': 'Start date must be before end date'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400
    try:
        ticker = yf.Ticker(ticker_symbol)
        ticker_data = ticker.history(start=start.strftime('%Y-%m-%d'), end=end.strftime('%Y-%m-%d'), interval='1d')
        if ticker_data.empty:
            return jsonify({"error": f"No data found for {ticker_symbol} at the given date range"}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve data for ticker {ticker_symbol}: {str(e)}'}), 500

    ticker_data.reset_index(inplace=True)
    count_arg = request.args.get('count')
    if not count_arg:
        count_arg = min(DEFAULT_POINTS, ticker_data.shape[0])
    total_points = ticker_data.shape[0]
    try:
        count = int(count_arg)
        if count <= 0:
            return jsonify({'error': 'Count must be greater than 0'}), 400
        if total_points < count:
            return jsonify({'error': f'Not enough data points for {ticker_symbol}'}), 400
        indices = np.linspace(0, total_points - 1, count).astype(int)
        points = ticker_data.iloc[indices].to_dict(orient='records')
    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400
    
    return jsonify(points)


def get_user(username):
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'error':'User not found'}), 404
    
    user_data = {
        'username' : user.username,
        'portfolios' : [{
            'id' : portfolio.id,
            'balance' : portfolio.balance,
            'last_accessed' : portfolio.last_accessed,
            'transactions' : [{
                'id' : transaction.id,
                'ticker' : transaction.ticker,
                'date' : transaction.date,
                'type' : transaction.trans_type,
                'price' : transaction.price,
                'shares' : transaction.shares,
                'total' : transaction.total_amount
            }for transaction in portfolio.transactions]
        }for portfolio in user.portfolios]
    }
    return jsonify(user_data)
    
def create_user():
    required_fields = ['username', 'password']
    data=request.json
    error, status = utils.verify_fields(data, required_fields)
    if error:
        return jsonify(error), status
    
    username = data['username']
    password = data['password']
    
    try:
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message':f'{username} has been successfully added.'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def create_portfolio():
    required_fields = ['username']
    data = request.json
    error, status = utils.verify_fields(data, required_fields)
    if error:
        return jsonify(error), status

    username = data['username']
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error':'User not found'}), 404

    balance_str = data['balance']
    if balance_str:
        try:
            balance = float(balance_str)
        except ValueError as e:
            return jsonify({'error': f'Invalid value: {str(e)}'}), 400
        new_portfolio = Portfolio(user_id=user.id, balance=float(balance_str))
    else:
        new_portfolio = Portfolio(user_id=user.id)

    try:
        db.session.add(new_portfolio)
        db.session.commit()
        return jsonify({'message':f'Portfolio for {username} has been successfully added.'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
def execute_transaction():
    required_fields = ['portfolioId', 'ticker', 'date', 'type', 'price', 'shares']
    data = request.json

    error, status = utils.verify_fields(data, required_fields)
    if error:
        return jsonify(error), status

    try:
        portfolio_id = int(data['portfolioId'])
        ticker = str(data['ticker'])
        date = datetime.strptime(data['date'], '%Y-%m-%d')
        trans_type = str(data['type'])
        if trans_type not in ['buy', 'sell']:
            return jsonify({'error': 'Type must be either buy or sell'}), 400
        price = float(data['price'])
        shares = int(data['shares'])
        total_amount = price*shares

    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400

    portfolio = Portfolio.query.get(portfolio_id)
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404
    
    if trans_type == 'buy':
        if portfolio.balance < total_amount:
            return jsonify({'error': 'Insufficient funds'}), 400
        portfolio.balance -= total_amount
    else:
        net_shares = utils.count_shares(portfolio_id, ticker)
        if shares > net_shares:
            return jsonify({'error': 'Insufficient shares'}), 400
        portfolio.balance += total_amount

    try:
        transaction = Transaction(
            portfolio_id = portfolio_id,
            ticker = ticker,
            date = date,
            trans_type = trans_type,
            price = price,
            shares = shares,
            total_amount = total_amount
        )

        db.session.add(transaction)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": 'Transaction has been processed'}), 200

def get_transaction_history():
    required_fields = ['portfolioId']
    error, status = utils.verify_fields(request.args, required_fields)
    if error:
        return jsonify(error), status
    try:
        portfolio_id = int(request.args.get('portfolioId'))
    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400
    
    ticker = request.args.get('ticker')
    if ticker:
        transactions = Transaction.query.filter_by(portfolio_id=portfolio_id).filter_by(ticker=ticker).order_by(Transaction.date.desc()).all()
    else:
        transactions = Transaction.query.filter_by(portfolio_id=portfolio_id).order_by(Transaction.date.desc()).all()
    return jsonify([{
        'ticker': t.ticker,
        'shares': t.shares,
        'price': t.price,
        'type': t.trans_type,
        'totalAmount': t.total_amount,
        'date': t.date.strftime('%Y-%m-%d')
    } for t in transactions])