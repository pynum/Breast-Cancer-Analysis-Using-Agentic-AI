# Breast Cancer Diagnostic Web Application

This project consists of a Flask backend (for AI-based models) and a React frontend (for user interaction and visualization).

---

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ and npm (for frontend)

---

## Getting Started

You will need **two separate terminals** open at the same time:
- One for the backend (Flask API)
- One for the frontend (React app)

---

## 1. Running the Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install Python dependencies (only needed the first time):

```bash
pip install -r requirements.txt
```

Run the Flask backend:

```bash
python app.py
```

- This will start the Flask server (by default on http://localhost:5000).
- The API endpoints (e.g., `/predict`) will be available for the frontend to connect.

---

## 2. Running the Frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install Node dependencies (only needed the first time):

```bash
npm install
```

Run the React frontend:

```bash
npm run dev
```

- This will start the frontend development server (by default on http://localhost:5173 or similar).
- The frontend will connect to the backend API for predictions and reports.

---

## How to Add Your Groq API Key

1. **Obtain your Groq API key**:
   - Go to [https://console.groq.com/keys](https://console.groq.com/keys) and log in.
   - Click **Create Key** if you don't have one.
   - Copy your API key (it will start with `gsk_...`).

2. **Open the backend code**:
   ```bash
   cd backend
   ```

3. **Edit `app.py`** and locate the following line:

```python
groq_client = Groq(api_key="YOUR_GROQ_API_KEY_HERE")
```

4. **Replace** the placeholder with your actual API key:

```python
groq_client = Groq(api_key="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
```

5. **Save the file**.

6. **Restart your backend server**:
   ```bash
   python app.py
   ```

---

## Usage

1. Open your browser and go to the frontend URL (e.g., http://localhost:5173).
2. Use the upload page to submit a thermal image and fill in patient details.
3. The backend will process the image, run the AI model, and return a detailed report and recommendations.
4. Results will be displayed in the frontend.

---

## Notes

- Both servers **must be running** at the same time for the application to work.
- If you change **backend code**, restart the Flask server.
- If you change **frontend code**, the Vite dev server will hot-reload automatically.
- Ensure the **backend API URL** in the frontend code matches your Flask server address (default is `http://localhost:5000`).

---

## Troubleshooting

- ❗ **CORS errors?** Make sure `flask-cors` is installed and enabled.
- ❗ **Model not found?** Ensure `thermal.keras` is in the backend directory.
- ❗ **Dependency issues?** Re-run `pip install -r requirements.txt` or `npm install`.

---

## Project Structure

```
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
```
