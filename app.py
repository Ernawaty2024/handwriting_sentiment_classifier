from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained Random Forest model
with open('optimized_rf_model.joblib', 'rb') as model_file:
    best_rf_model = joblib.load(model_file)

# Function to preprocess the handwriting data
def preprocess_data(handwriting_data, age, gender, grade):
    # Extract features from the handwriting data
    speeds_b = [d['speed'] for d in handwriting_data if 'bold' in d and 'speed' in d]
    pressures_b = [d['pressure'] for d in handwriting_data if 'bold' in d and 'pressure' in d]
    tiltXs_b = [d['tiltX'] for d in handwriting_data if 'bold' in d and 'tiltX' in d]
    tiltYs_b = [d['tiltY'] for d in handwriting_data if 'bold' in d and 'tiltY' in d]
    azimuths_b = [d['azimuth'] for d in handwriting_data if 'bold' in d and 'azimuth' in d]
    strokes_b = len(speeds_b)
    modulus_altitude_b = np.std(tiltYs_b)

    speeds_c = [d['speed'] for d in handwriting_data if 'cursive' in d and 'speed' in d]
    pressures_c = [d['pressure'] for d in handwriting_data if 'cursive' in d and 'pressure' in d]
    tiltXs_c = [d['tiltX'] for d in handwriting_data if 'cursive' in d and 'tiltX' in d]
    tiltYs_c = [d['tiltY'] for d in handwriting_data if 'cursive' in d and 'tiltY' in d]
    azimuths_c = [d['azimuth'] for d in handwriting_data if 'cursive' in d and 'azimuth' in d]
    strokes_c = len(speeds_c)
    modulus_altitude_c = np.std(tiltYs_c)

    # Aggregate features (e.g., mean values)
    features = [
        age,               # Age as an input
        gender,            # Gender: 0 (boy), 1 (girl)
        grade,             # Grade
        np.mean(speeds_c) if speeds_c else 0,  # Speed_C
        strokes_c,         # Number Stroke_C
        np.mean(pressures_c) if pressures_c else 0,  # Mean Pressure_C
        np.mean(tiltYs_c) if tiltYs_c else 0,        # Mean Altitude_C
        modulus_altitude_c,                          # Modulus Altitude_C
        np.mean(azimuths_c) if azimuths_c else 0,    # Mean Azimuth_C
        np.std(azimuths_c) if azimuths_c else 0,     # Modulus Azimuth_C
        np.mean(speeds_b) if speeds_b else 0,        # Speed_B
        strokes_b,                                   # Number Stroke_B
        np.mean(pressures_b) if pressures_b else 0,  # Mean Pressure_B
        np.mean(tiltYs_b) if tiltYs_b else 0,        # Mean Altitude_B
        modulus_altitude_b,                          # Modulus Altitude_B
        np.mean(azimuths_b) if azimuths_b else 0,    # Mean Azimuth_B
        np.std(azimuths_b) if azimuths_b else 0      # Modulus Azimuth_B
    ]
    # Return the features as a numpy array
    return np.array([features])

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for handling handwriting submission and making predictions
@app.route('/submit_handwriting', methods=['POST'])
def submit_handwriting():
    # Get the handwriting data from the front-end
    handwriting_data = request.json['handwriting_data']
    age = request.json['age']
    gender = request.json['gender']
    grade = request.json['grade']

    # Preprocess the data to get the features for prediction
    preprocessed_data = preprocess_data(handwriting_data, age, gender, grade)

    # Make prediction using the Random Forest model
    prediction = best_rf_model.predict(preprocessed_data)

    # Send the prediction result back to the front-end
    return jsonify({'emotion': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
