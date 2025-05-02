Breast Cancer Diagnostic Web Application
========================================

This project consists of a Flask backend (for AI-based models) and a React frontend (for user interaction and visualization).

Prerequisites
-------------
- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)

Getting Started
---------------
You will need two separate terminals open at the same time:
- One for the backend (Flask API)
- One for the frontend (React app)

1. Running the Backend
----------------------
Open a terminal and navigate to the backend directory:

    cd backend

Install Python dependencies (only needed the first time):

    pip install -r requirements.txt

Run the Flask backend:

    python app.py

- This will start the Flask server (by default on http://localhost:5000).
- The API endpoints (e.g., /predict) will be available for the frontend to connect.

2. Running the Frontend
-----------------------
Open a second terminal and navigate to the frontend directory:

    cd frontend

Install Node dependencies (only needed the first time):

    npm install

Run the React frontend:

    npm run dev

- This will start the frontend development server (by default on http://localhost:5173 or similar).
- The frontend will connect to the backend API for predictions and reports.

## How to Add Your Groq API Key
-----------------------------------
1. Obtain your Groq API key:
   - Go to [https://console.groq.com/keys](https://console.groq.com/keys) and log in.
   - Click "Create Key" if you don't have one.
   - Copy your API key (it will start with `gsk_...`).

2. Open the backend code:
   - Navigate to your backend folder:
     ```
     cd backend
     ```
   - Open the file `app.py` in your preferred text editor (e.g., VS Code, Notepad).

3. Find the Groq client initialization:
   - Look for the line in `app.py` that looks like this:
     ```python
     groq_client = Groq(api_key="YOUR_GROQ_API_KEY_HERE")
     ```
     (It may already have a placeholder or an old key.)

4. Replace the API key:
   - Replace `"YOUR_GROQ_API_KEY_HERE"` (or the existing key) with your actual Groq API key.
   - For example:
     ```python
     groq_client = Groq(api_key="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
     ```
5. Save the file.

6. Restart your backend server:
   - If your backend is running, stop it (press `Ctrl+C` in the terminal).
   - Start it again:
     ```
     python app.py
     ```

Usage
-----
1. Open your browser and go to the frontend URL (e.g., http://localhost:5173).
2. Use the upload page to submit a thermal image and fill in patient details.
3. The backend will process the image, run the AI model, and return a detailed report and recommendations.
4. Results will be displayed in the frontend.

Notes
-----
- Both servers must be running at the same time for the application to work.
- If you change backend code, restart the Flask server.
- If you change frontend code, the Vite dev server will hot-reload automatically.
- Make sure the backend API URL in the frontend code matches your Flask server address (default is http://localhost:5000).

Troubleshooting
---------------
- If you get CORS errors, ensure flask-cors is installed and enabled in your backend.
- If the model is not found, make sure thermal.keras (or your model file) is in the backend directory.
- For any Python or Node.js dependency errors, re-run the install commands above.

Project Structure
-----------------
project-root/
│
├── backend/
│   ├── app.py
│   ├── thermal.keras
│   └── ... (other backend files)
│
└── frontend/
    ├── src/
    ├── package.json
    └── ... (other frontend files)
