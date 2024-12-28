from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy 

STARTING_BALANCE = 500

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    portfolios = db.relationship('Portfolio', backref='account')

class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    balance = db.Column(db.Integer, nullable=False, default=STARTING_BALANCE)
    transactions = db.relationship('Transaction', backref='portfolio')
    last_accessed = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    portfolio = db.Column(db.Integer, db.ForeignKey('portfolio.id'), nullable=False)
    ticker = db.Column(db.String(5), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.now(tz=timezone.utc))
    trans_type = db.Column(db.Enum('buy','sell',name='trans_type_enum'), nullable=False)
    amount = db.Column(db.Float, nullable=False)