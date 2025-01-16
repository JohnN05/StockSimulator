from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy 

STARTING_BALANCE = 500

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))
    portfolios = db.relationship('Portfolio', backref='user')

    def __repr__(self):
        return f"User('{self.id}, {self.username}', {self.date_created})"


class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    balance = db.Column(db.Float, nullable=False)
    transactions = db.relationship('Transaction', backref='portfolio')
    date = db.Column(db.DateTime, nullable=False)
    last_accessed = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))

    def __repr__(self):
        return f"Portfolio('{self.user.username}', {self.balance}, {self.last_accessed})"

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.id'), nullable=False)
    ticker = db.Column(db.String(5), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))
    action = db.Column(db.Enum('buy','sell',name='trans_type_enum'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"Transaction('{self.originator.id}', {self.ticker}, {self.date}, {self.action}, {self.total_amount})"