from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Chargement modèle ML
model_path = os.path.join('..', '..', 'models', 'modele_maintenance.pkl')
model = joblib.load(model_path)

@app.route('/')
def home():
    return jsonify({'message': '✅ Flask ML API opérationnelle !'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = ['Intensite','Vitesse','T_Bobinage_1','T_Bobinage_2',
                'T_Bobinage_3','T_Palier_1_moteur','T_Palier_2_moteur',
                'Vibration','T_Palier_1_vent','T_Palier_2_vent','Debit_air']
    df = pd.DataFrame([data])[features]
    prediction = model.predict(df)[0]
    proba = model.predict_proba(df)[0]
    return jsonify({
        'panne': int(prediction),
        'confiance': round(float(max(proba)) * 100, 2),
        'message': '⚠️ PANNE PROBABLE' if prediction == 1 else '✅ NORMAL'
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)