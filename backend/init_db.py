import os
from app import app
from models import db, User, Portfolio, Transaction

def create_database():
    if not os.path.exists('instance/site.db'):
        os.makedirs('instance', exist_ok=True) 
        open('instance/app.db', 'w').close() 
        print("Database file created.")
    else:
        print("Database file already exists.")

def initialize_db():
    with app.app_context():
        db.create_all()
        print("Database tables created.")
    
if __name__ == '__main__': 
    create_database() 
    initialize_db()