from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained Random Forest model
try:
    with open('optimized_rf_model.joblib', 'rb') as model_file:
        best_rf_model = joblib.load(model_file)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# Function to preprocess the handwriting data
def preprocess_data(handwriting_data):
    # Handle cases where speed, pressure, etc., may be None
    speeds = [d['speed'] for d in handwriting_data if 'speed' in d and d['speed'] is not None]
    pressures = [d['pressure'] for d in handwriting_data if 'pressure' in d and d['pressure'] is not None]
    tiltXs = [d['tiltX'] for d in handwriting_data if 'tiltX' in d and d['tiltX'] is not None]
    tiltYs = [d['tiltY'] for d in handwriting_data if 'tiltY' in d and d['tiltY'] is not None]
    azimuths = [d['azimuth'] for d in handwriting_data if 'azimuth' in d and d['azimuth'] is not None]

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
    try:
        # Get the handwriting data from the front-end
        handwriting_data = request.json
        print(f"Received handwriting data: {handwriting_data}")
        
        # Check if the data is received correctly
        if handwriting_data is None:
            return jsonify({'error': 'No data received'}), 400
        
        # Preprocess the data to get the features for prediction
        preprocessed_data = preprocess_data(handwriting_data)
        
        # Make prediction using the Random Forest model
        prediction = best_rf_model.predict(preprocessed_data)
        
        # Log the prediction result to check if it works correctly
        print(f"Prediction: {prediction}")

        # Return the prediction result as JSON
        return jsonify({'emotion': prediction[0]})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
