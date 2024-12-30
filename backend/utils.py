from sqlalchemy import case, func
from routes import db
from models import User, Portfolio, Transaction

def count_shares(portfolio_id, ticker):
    net_shares = db.session.query(
            func.sum(
                case([(Transaction.trans_type == 'buy', Transaction.shares)], 
                     else_=-Transaction.shares)
            )
        ).filter_by(portfolio_id=portfolio_id, ticker=ticker).scalar() or 0
    return net_shares