# Stock Simulator

## Overview
This web-based stock market simulator provides users with an immersive platform to practice trading using virtual money and real-time market data. Powered by yFinance, the simulator supports creating multiple portfolios across different dates, offering insights into individual portfolio performance.

## Features
- Virtual trading personal portfolios
- Historical performance tracking
- User authentication and account management

# Installation Instructions
Follow these steps to setup and run the frontend and backend of the stock simulator.

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16.x or higher
- npm (usually comes with Node.js)

## Setting up the project

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. (Optional but recommended) Create a virtual environment:
```bash
python -m venv venv

# On Windows
.\venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Starting the Application

### Start the Frontend
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Build the frontend (required for production/backend serving):
```bash
npm run build
```

3. (Optional) Start the development server for live development:
```bash
npm run dev
```

### Start the Backend
1. Navigate to the backend directory:
```bash
cd backend
```

2. Initialize the database (only needed for first time setup):
```bash
python init_db.py
```

3. Start the Flask server:
```bash
python app.py
```

Note: The backend serves the frontend from the `dist` directory, so make sure to run `npm run build` in the frontend directory before starting the backend server.

## Technologies Used
- Frontend: React, TypeScript, Material-UI, TailwindCSS
- Backend: Python, Flask, SQLAlchemy
- Data: Real-time stock market data via various financial APIs

## Authors

[JohnN05](https://github.com/JohnN05) - Developer

[vincenthuang0908](https://github.com/vincenthuang0908) - Developer

