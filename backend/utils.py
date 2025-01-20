import jwt
from datetime import datetime, timedelta, timezone
from sqlalchemy import case, func
from routes import db
from models import User, Portfolio, Transaction

def count_shares(portfolio_id, ticker):
    net_shares = db.session.query(
            func.sum(
                case(
                (Transaction.action == 'buy', Transaction.shares),
                else_=-Transaction.shares
                )
            )
        ).filter_by(portfolio_id=portfolio_id, ticker=ticker).scalar() or 0
    return net_shares

def authenticate_header(auth_headers):
    if 'Authorization' not in auth_headers:
        raise Exception('Missing Authorization header')
    auth_header = auth_headers['Authorization']
    if not auth_header.startswith('Bearer '):
        raise Exception('Invalid Authorization header')
    token = auth_header.split(' ')[1]
    payload = validate_token(token)
    username = payload['sub']

    return username

def verify_fields(args, required_fields):
    for field in required_fields:
        if field not in args:
            return {'error': 'Missing field: ' + field}, 400
    return {}, 200

def generate_token(username):
    try:
        payload = {
            'sub': username,
            'iat': datetime.now(tz=timezone.utc),
            'exp':datetime.now(tz=timezone.utc) + timedelta(hours=2)
        }
    
        token = jwt.encode(payload, "TEMP_SECRET", algorithm='HS256')
    except Exception as e:
        return str(e)
    
    return token

def validate_token(token):
    try:
        payload = jwt.decode(token, "TEMP_SECRET", algorithms=['HS256'])
        return payload

    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError("Token has expired")

    except jwt.InvalidTokenError:
        raise jwt.InvalidTokenError("Invalid token")