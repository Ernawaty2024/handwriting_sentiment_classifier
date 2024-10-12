from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained Random Forest model
with open('optimized_rf_model.joblib', 'rb') as model_file:
    best_rf_model = joblib.load(model_file)

# Function to preprocess the handwriting data
def preprocess_data(handwriting_data, age, gender, grade):
    # Separate bold and cursive data
    bold_data = [d for d in handwriting_data if d['box'] == 'bold']
    cursive_data = [d for d in handwriting_data if d['box'] == 'cursive']

    # Extract features for bold and cursive separately
    features_bold = extract_features(bold_data)
    features_cursive = extract_features(cursive_data)

    # Combine features with age, gender, and grade
    features_combined = [
        age, gender, grade,
        *features_cursive, *features_bold
    ]

    return np.array([features_combined])

# Helper function to extract features from handwriting data
def extract_features(data):
    speeds = [d['speed'] for d in data if 'speed' in d]
    pressures = [d['pressure'] for d in data if 'pressure' in d]
    tiltXs = [d['tiltX'] for d in data if 'tiltX' in d]
    tiltYs = [d['tiltY'] for d in data if 'tiltY' in d]
    azimuths = [d['azimuth'] for d in data if 'azimuth' in d]
    
    # Modulus calculations for azimuth and tilt
    modulus_azimuth = np.sqrt(np.mean(np.square(azimuths))) if azimuths else 0
    modulus_tilt = np.sqrt(np.mean(np.square(tiltXs)) + np.mean(np.square(tiltYs))) if tiltXs and tiltYs else 0

    return [
        len(data),  # Number of strokes
        np.mean(pressures) if pressures else 0,
        np.mean(tiltXs) if tiltXs else 0,
        np.mean(tiltYs) if tiltYs else 0,
        modulus_tilt,
        np.mean(azimuths) if azimuths else 0,
        modulus_azimuth
    ]

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for handling handwriting submission and making predictions
@app.route('/submit_handwriting', methods=['POST'])
def submit_handwriting():
    try:
        # Get the handwriting data from the front-end
        data = request.json
        handwriting_data = data.get('handwriting_data')  # Use .get() to avoid KeyError
        age = int(data['age'])
        gender = int(data['gender'])
        grade = int(data['grade'])

        if handwriting_data is None:
            return jsonify({'error': 'No handwriting data provided'}), 400

        # Preprocess the data to get the features for prediction
        preprocessed_data = preprocess_data(handwriting_data, age, gender, grade)

        # Make prediction using the Random Forest model
        prediction = best_rf_model.predict(preprocessed_data)

        # Send the prediction result back to the front-end
        return jsonify({'emotion': prediction[0]})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
