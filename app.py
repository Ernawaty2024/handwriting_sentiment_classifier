from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained Random Forest model
with open('optimized_rf_model.joblib', 'rb') as model_file:
    best_rf_model = joblib.load(model_file)

# Function to preprocess the handwriting data
def preprocess_data(handwriting_data):
    # Extract features from the handwriting data
    speeds = [d['speed'] for d in handwriting_data if 'speed' in d]
    pressures = [d['pressure'] for d in handwriting_data if 'pressure' in d]
    tiltXs = [d['tiltX'] for d in handwriting_data if 'tiltX' in d]
    tiltYs = [d['tiltY'] for d in handwriting_data if 'tiltY' in d]
    azimuths = [d['azimuth'] for d in handwriting_data if 'azimuth' in d]

    # Aggregate features (e.g., mean values)
    features = [
        np.mean(speeds) if speeds else 0,
        np.mean(pressures) if pressures else 0,
        np.mean(tiltXs) if tiltXs else 0,
        np.mean(tiltYs) if tiltYs else 0,
        np.mean(azimuths) if azimuths else 0
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
    handwriting_data = request.json

    # Preprocess the data to get the features for prediction
    preprocessed_data = preprocess_data(handwriting_data)

    # Make prediction using the Random Forest model
    prediction = best_rf_model.predict(preprocessed_data)

    # Send the prediction result back to the front-end
    return jsonify({'emotion': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
