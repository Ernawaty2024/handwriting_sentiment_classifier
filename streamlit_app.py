import streamlit as st
import joblib
import numpy as np

# Load the trained Random Forest model
@st.cache_resource
def load_model():
    with open('optimized_rf_model.joblib', 'rb') as model_file:
        return joblib.load(model_file)

best_rf_model = load_model()

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

# Streamlit UI for the application
st.title('Handwriting Sentiment Classifier')

# Collect handwriting data from the user
st.subheader('Handwriting Data Input')

# Using text_area to simulate handwriting data input as JSON-like structure
handwriting_input = st.text_area("Paste the handwriting data (JSON format):", height=200)

# Button to trigger prediction
if st.button("Submit Handwriting"):
    try:
        # Convert the input text to a Python dict (Assuming it's provided in JSON format)
        handwriting_data = eval(handwriting_input)  # Alternatively, use json.loads() if input is in strict JSON format

        # Preprocess the data for prediction
        preprocessed_data = preprocess_data(handwriting_data)

        # Make prediction using the Random Forest model
        prediction = best_rf_model.predict(preprocessed_data)

        # Display the result
        st.success(f"Predicted Emotion: {prediction[0]}")
    except Exception as e:
        st.error(f"Error processing input: {e}")

