from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import sys
from groq import Groq
sys.path.append('..')  # Add parent directory to Python path
from report_analysis.main import get_gnn_embeddings
from report_analysis.llm_report_generator import generate_report

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Groq client
groq_client = Groq(api_key="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")  

# Simulated diagnostic prediction logic
def diagnostic_agent(image):
    benign = random.randint(40, 90)
    malignant = 100 - benign
    return [
        {"name": "Benign", "value": benign},
        {"name": "Malignant", "value": malignant}
    ]

# Generate a textual report based on diagnosis
def report_generation_agent(patient_id, image_name, diagnosis):
    dominant = max(diagnosis, key=lambda x: x['value'])['name']
    return (
        f"Image ({image_name}) linked to patient ID {patient_id} shows signs of {dominant.lower()}. "
        "Further tests like a biopsy are recommended for confirmation."
    )

# Provide recommendations based on probability of malignancy
def recommendation_agent(diagnosis):
    mal_prob = next((x['value'] for x in diagnosis if x['name'] == 'Malignant'), 0)
    return [
        {"name": "Further Tests", "value": 10 if mal_prob > 60 else 5},
        {"name": "Lifestyle Changes", "value": 3 if mal_prob > 60 else 7},
        {"name": "Medication", "value": 5 if mal_prob > 70 else 2},
        {"name": "Surgery", "value": 8 if mal_prob > 80 else 1},
    ]

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    patient_id = request.form.get("patientId", "Unknown")
    image_name = file.filename

    # Simulate processing
    diagnosis = diagnostic_agent(file)
    report = report_generation_agent(patient_id, image_name, diagnosis)
    recommendations = recommendation_agent(diagnosis)

    return jsonify({
        "diagnosis": diagnosis,
        "report": report,
        "recommendations": recommendations
    })

@app.route("/api/groq-chat", methods=["POST"])
def groq_chat():
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input.strip():
        return jsonify({"reply": "Please enter a valid message."}), 400

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Update if you're using a different model
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful and knowledgeable AI assistant that provides answers about "
                        "breast cancer diagnosis, treatment options, and patient guidance."
                    )
                },
                {"role": "user", "content": user_input}
            ],
        )

        ai_reply = response.choices[0].message.content
        return jsonify({"reply": ai_reply})

    except Exception as e:
        print(f"Groq API Error: {e}")
        return jsonify({"reply": "Sorry, I couldn't process your request. Please try again later."}), 500

@app.route("/gnn-report", methods=["POST"])
def generate_gnn_report():
    try:
        data = request.get_json()
        
        # Extract features from request
        age = float(data.get("age", 0))  # normalized age
        density = float(data.get("density", 0))
        lump = float(data.get("lump", 0))
        history = float(data.get("history", 0))
        
        user_features = [age, density, lump, history]
        
        # Get GNN embeddings
        embeddings = get_gnn_embeddings(user_features).detach()
        
        # Format embeddings for report generation
        patient = embeddings[0].tolist()
        diagnosis = embeddings[1].tolist()
        text_input = (
            f"Patient Embedding: {patient}\n"
            f"Diagnosis Embedding: {diagnosis}\n"
        )
        
        # Generate report
        report = generate_report(text_input)
        
        return jsonify({
            "success": True,
            "report": report,
            "embeddings": {
                "patient": patient,
                "diagnosis": diagnosis
            }
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
