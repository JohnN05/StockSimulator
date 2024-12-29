from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy 

STARTING_BALANCE = 500

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))
    portfolios = db.relationship('Portfolio', backref='account')
    trades = db.relationship('Trade', backref='user', lazy=True)

    def __repr__(self):
        return f"User('{self.username}', {self.date_created})"


class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(20), db.ForeignKey('user.username'), nullable=False)
    balance = db.Column(db.Integer, nullable=False, default=STARTING_BALANCE)
    transactions = db.relationship('Transaction', backref='originator')
    last_accessed = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))

    def __repr__(self):
        return f"Portfolio('{self.user_id}', {self.balance}, {self.last_accessed})"

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.id'), nullable=False)
    ticker = db.Column(db.String(5), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))
    trans_type = db.Column(db.Enum('buy','sell',name='trans_type_enum'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"Transaction('{self.originator.id}', {self.ticker}, {self.date}, {self.trans_type}, {self.amount})"