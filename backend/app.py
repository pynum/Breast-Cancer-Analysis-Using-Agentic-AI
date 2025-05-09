import os
import sys
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from groq import Groq
from dotenv import load_dotenv

# --- ENVIRONMENT SETUP ---
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Load .env file
load_dotenv()

# Add parent directory to Python path
sys.path.append('..')

# --- FLASK APP INIT ---
app = Flask(__name__)
CORS(app)

# --- GROQ CLIENT INIT ---
groq_client = Groq(api_key=os.getenv("GROQ_API"))

# --- LOAD MODEL ---
def load_model_file():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_names = ['thermal.keras']

        for model_name in model_names:
            model_path = os.path.join(current_dir, model_name)
            if os.path.exists(model_path):
                print(f"✅ Found model at: {model_path}")
                loaded_model = load_model(model_path)
                print("✅ Model loaded successfully")
                return loaded_model
                
        print("❌ Error: No model file found. Looked for:", model_names)
        return None
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return None

model = load_model_file()

# --- IMAGE PREPROCESSING ---
def preprocess_image(file_path, target_size=(224, 224)):
    img = image.load_img(file_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

# --- PREDICTION ---
def get_prediction(image_array):
    try:
        prediction = model.predict(image_array)
        malignant_prob = float(prediction[0][1]) * 100
        benign_prob = float(prediction[0][0]) * 100
        return [
            {"name": "Benign", "value": round(benign_prob, 2)},
            {"name": "Malignant", "value": round(malignant_prob, 2)}
        ]
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return None

# --- REPORT GENERATION ---
def generate_detailed_report(patient_data, diagnosis_results):
    try:
        age = patient_data.get('age', 'N/A')
        image_type = patient_data.get('image_type', 'N/A')
        has_lump = patient_data.get('lump', 'N/A')
        family_history = patient_data.get('family', 'N/A')
        breast_density = patient_data.get('density', 'N/A')

        benign_prob = next((x['value'] for x in diagnosis_results if x['name'] == 'Benign'), 0)
        malignant_prob = next((x['value'] for x in diagnosis_results if x['name'] == 'Malignant'), 0)

        prompt = f"""As a medical AI assistant, generate a detailed diagnostic report and recommendations based on the following breast cancer screening information:

Patient Profile:
- Age: {age} years
- Imaging Method: {image_type}
- Presence of Lump: {has_lump}
- Family History of Breast Cancer: {family_history}
- Breast Density: {breast_density}

AI Analysis Results:
- Benign Probability: {benign_prob}%
- Malignant Probability: {malignant_prob}%

Please provide:
1. A detailed diagnostic assessment
2. Risk factor analysis
3. Specific recommendations for follow-up care
4. Lifestyle and preventive measures
5. Additional screening recommendations if needed

Format the response in a clear, professional medical report style."""

        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a specialized medical AI assistant focused on breast cancer diagnosis and recommendations."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=1024
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"❌ Error generating detailed report: {e}")
        return None

# --- RECOMMENDATION GENERATION ---
def generate_recommendations(patient_data, diagnosis_results):
    try:
        malignant_prob = next((x['value'] for x in diagnosis_results if x['name'] == 'Malignant'), 0)
        age = patient_data.get('age', 'N/A')
        family_history = patient_data.get('family', 'N/A')

        prompt = f"""Based on the following patient information and AI analysis results, provide specific, prioritized recommendations:

Patient Details:
- Age: {age}
- Family History: {family_history}
- Malignancy Probability: {malignant_prob}%

Please provide 5 specific recommendations, each with:
1. Priority level (1-10)
2. Timeframe for action
3. Specific details about the recommendation
4. Rationale for the recommendation

Format as a structured list suitable for medical professionals."""

        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a medical AI specialist in breast cancer care recommendations."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=1024
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"❌ Error generating recommendations: {e}")
        return None

# --- CHAT ENDPOINT ---
@app.route("/api/groq-chat", methods=["POST"])
def groq_chat():
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input.strip():
        return jsonify({"reply": "Please enter a valid message."}), 400

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful and knowledgeable AI assistant that provides answers about breast cancer diagnosis, treatment options, and patient guidance."},
                {"role": "user", "content": user_input}
            ],
        )
        ai_reply = response.choices[0].message.content
        return jsonify({"reply": ai_reply})
    except Exception as e:
        print(f"❌ Groq API Error: {e}")
        return jsonify({"reply": "Sorry, I couldn't process your request. Please try again later."}), 500

# --- PREDICT ENDPOINT ---
@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("Received files:", request.files)
        print("Received form data:", request.form)

        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        patient_data = {
            "age": request.form.get("age", "N/A"),
            "image_type": request.form.get("image_type", "N/A"),
            "lump": request.form.get("lump", "N/A"),
            "family": request.form.get("family", "N/A"),
            "density": request.form.get("density", "N/A")
        }

        image_name = file.filename
        temp_path = os.path.join(os.getcwd(), f"temp_{image_name}")
        file.save(temp_path)

        if not os.path.exists(temp_path):
            return jsonify({"error": "Failed to save uploaded file"}), 500

        try:
            processed_image = preprocess_image(temp_path)
        except Exception as e:
            return jsonify({"error": f"Error preprocessing image: {str(e)}"}), 500

        diagnosis = get_prediction(processed_image)
        if diagnosis is None:
            return jsonify({"error": "Prediction failed"}), 500

        detailed_report = generate_detailed_report(patient_data, diagnosis)
        detailed_recommendations = generate_recommendations(patient_data, diagnosis)

        if detailed_report is None or detailed_recommendations is None:
            return jsonify({"error": "Failed to generate detailed report"}), 500

        try:
            os.remove(temp_path)
        except Exception as e:
            print(f"⚠️ Warning: Could not remove temporary file: {str(e)}")

        return jsonify({
            "diagnosis": diagnosis,
            "detailed_report": detailed_report,
            "detailed_recommendations": detailed_recommendations
        })
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        try:
            if 'temp_path' in locals():
                os.remove(temp_path)
        except:
            pass
        return jsonify({"error": str(e)}), 500

# --- MAIN ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Default if not set
    print(f"🚀 App is running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
