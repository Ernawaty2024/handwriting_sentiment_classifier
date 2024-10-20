from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained Random Forest model
with open('fine_tuned_rf_model.joblib', 'rb') as model_file:
    best_rf_model_fine_tune = joblib.load(model_file)

# Function to preprocess the handwriting data
def preprocess_data(handwriting_data):
    # Check if handwriting_data is a dictionary with 'bold' and 'cursive' keys
    if isinstance(handwriting_data, dict):
        bold_data = handwriting_data.get('bold', [])
        cursive_data = handwriting_data.get('cursive', [])
    else:
        raise ValueError("Invalid data format for handwriting_data")
    
    # Extract features for bold and cursive separately
    features_bold = extract_features(bold_data, stroke_type='bold')
    features_cursive = extract_features(cursive_data, stroke_type='cursive')

    # Combine handwriting features 
    features_combined = [
        *features_cursive,  # Features for cursive strokes
        *features_bold      # Features for bold strokes
    ]

    # Check if features_combined has exactly 14 elements
    if len(features_combined) != 14:
        raise ValueError(f"Expected 14 features, but got {len(features_combined)}")

    # Print the number of features captured
    print(f"Number of features captured: {len(features_combined)}")

    return np.array([features_combined])

# Helper function to extract features from handwriting data
def extract_features(data, stroke_type='bold'):
    if not data:  # If data is empty, return default values
        return [0, 0, 0, 0, 0, 0, 0]
    
    speeds = [d['speed'] for d in data if 'speed' in d]
    pressures = [d['pressure'] for d in data if 'pressure' in d]
    tiltXs = [d['tiltX'] for d in data if 'tiltX' in d]
    tiltYs = [d['tiltY'] for d in data if 'tiltY' in d]
    azimuths = [d['azimuth'] for d in data if 'azimuth' in d]

    # Calculate combined mean altitude as a single feature
    mean_altitude = np.sqrt(np.mean(np.square(tiltXs)) + np.mean(np.square(tiltYs))) if tiltXs and tiltYs else 0

    # Modulus calculations for azimuth and tilt
    modulus_azimuth = np.sqrt(np.mean(np.square(azimuths))) if azimuths else 0
    modulus_altitude = np.mean(np.abs(tiltXs)) + np.mean(np.abs(tiltYs)) if tiltXs and tiltYs else 0

    # Print the extracted values for logging/debugging purposes
    print(f"\nExtracting features for {stroke_type} strokes:")
    print(f"  Speed: {np.mean(speeds) if speeds else 0}")
    print(f"  Number of strokes: {len(data)}")
    print(f"  Mean pressure: {np.mean(pressures) if pressures else 0}")
    print(f"  Mean altitude: {mean_altitude}")
    print(f"  Modulus altitude: {modulus_altitude}")
    print(f"  Mean azimuth: {np.mean(azimuths) if azimuths else 0}")
    print(f"  Modulus azimuth: {modulus_azimuth}")

    return [
        np.mean(speeds) if speeds else 0,
        len(data),  # Number of strokes
        np.mean(pressures) if pressures else 0,
        mean_altitude,  # Consolidated mean altitude (from tiltX and tiltY)
        modulus_altitude,
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
        # Get the handwriting data and demographic info from the front-end
        data = request.json
        handwriting_data = data.get('handwriting_data')  
        age = data.get('age')
        gender = data.get('gender')
        grade = data.get('grade')
        
        # Log the received handwriting data
        app.logger.info(f"Received handwriting data: {handwriting_data}, Age: {age}, Gender: {gender}, Grade: {grade}")
        
        if handwriting_data is None:
            return jsonify({'error': 'Handwriting data is required.'}), 400
        
        # Preprocess the data to get the features for prediction
        preprocessed_data = preprocess_data(handwriting_data)
        
        # Make prediction using the Random Forest model
        prediction = best_rf_model_fine_tune.predict(preprocessed_data)
        
        # Log the prediction result
        app.logger.info(f"Prediction result: {prediction[0]}")
        
        # Send the prediction result back to the front-end
        return jsonify({'emotion': prediction[0]})
    except Exception as e:
        app.logger.error(f"Error processing the request: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
