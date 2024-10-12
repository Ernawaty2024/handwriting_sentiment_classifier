from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained Random Forest model
with open('optimized_rf_model.joblib', 'rb') as model_file:
    best_rf_model = joblib.load(model_file)

# Function to preprocess the handwriting data
def preprocess_data(handwriting_data):
    speeds = [d['speed'] for d in handwriting_data if 'speed' in d]
    pressures = [d['pressure'] for d in handwriting_data if 'pressure' in d]
    tiltXs = [d['tiltX'] for d in handwriting_data if 'tiltX' in d]
    tiltYs = [d['tiltY'] for d in handwriting_data if 'tiltY' in d]
    azimuths = [d['azimuth'] for d in handwriting_data if 'azimuth' in d]

    # Aggregated features
    features = [
        np.mean(speeds) if speeds else 0,
        np.mean(pressures) if pressures else 0,
        np.mean(tiltXs) if tiltXs else 0,
        np.mean(tiltYs) if tiltYs else 0,
        np.mean(azimuths) if azimuths else 0
    ]
    return np.array([features])

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for handling handwriting submission and making predictions
@app.route('/submit_handwriting', methods=['POST'])
def submit_handwriting():
    data = request.json
    age = int(data['age'])
    gender = data['gender']
    grade = int(data['grade'])
    handwriting_data = data['drawingData']

    # Preprocess the handwriting data
    preprocessed_data = preprocess_data(handwriting_data)

    # Append the additional features (age, gender, grade)
    gender_numeric = 1 if gender == 'M' else 0
    additional_features = np.array([[age, gender_numeric, grade]])

    # Combine with handwriting data
    final_data = np.hstack((additional_features, preprocessed_data))

    # Make the prediction
    prediction = best_rf_model.predict(final_data)
    
    # Send the prediction result back to the front-end
    return jsonify({'emotion': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
