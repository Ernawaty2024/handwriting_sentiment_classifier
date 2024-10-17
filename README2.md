## Project Overview
The Handwriting Emotion Detection project leverages graphology to predict emotional states from handwriting data. By collecting key features such as pressure, speed, tilt, and stroke types (cursive and bold), it predicts the emotion of the writer using a trained machine learning model, specifically a Random Forest classifier.

The project is hosted on Heroku and can be accessed here: [Handwriting Emotion Detection](https://graphology-emotion-detector-4523ecd5cbab.herokuapp.com/).

## Content
- **index.html**: The front-end page for collecting user data (age, gender, grade) and handwriting samples.
- **handwriting.js**: JavaScript logic for handling the drawing canvas and capturing handwriting data.
- **Flask back-end**: Python Flask framework for handling predictions.
- **optimized_rf_model.joblib**: Pre-trained Random Forest model for emotion detection.
- **style.css**: CSS for styling the web application.
  
## Usage
1. **Select Age, Gender, and Grade**: Users must input their demographic information.
2. **Handwriting Input**: The user writes on the canvas. Two boxes are provided: one for bold strokes and one for cursive.
3. **Submit**: Once the user has completed their handwriting input, the data is processed and sent to the back-end for emotion prediction.
4. **Result**: The predicted emotion is displayed on the screen.

## Business View
Handwriting analysis has a wide range of potential applications in education, mental health, and security. In this project, emotional prediction from handwriting could be utilized in the following scenarios:
- **Educational Assessment**: Detecting student stress or anxiety levels from handwriting patterns during tests.
- **Mental Health Monitoring**: Identifying emotional distress based on changes in handwriting characteristics.
- **Forensic Analysis**: Using handwriting data as part of forensic investigations to assess emotional states of suspects or individuals.

## Limitations
1. **Small Dataset**: The model is trained on a limited dataset, which might reduce its generalizability across different handwriting styles.
2. **Handwriting Variability**: Handwriting characteristics can vary significantly across cultures and individual habits, which may affect prediction accuracy.
3. **Limited Feature Scope**: Only basic handwriting features such as speed, pressure, tilt, and stroke count are considered. More complex analysis such as letter formation or overall style is not yet included.

## Calculations / Formulas
The key handwriting features used for emotion detection are calculated as follows:

- **Speed**: 
  \[
  Speed = \frac{\sqrt{x^2 + y^2}}{\Delta Time}
  \]
  Where \(x\) and \(y\) are the coordinates of the handwriting strokes, and \(\Delta Time\) is the time difference between two consecutive points.

- **Pressure**: The pressure is recorded directly from the drawing input device (e.g., stylus). If pressure is not provided, a default value is used.

- **Mean Altitude**: 
  \[
  Mean \ Altitude = \sqrt{Mean(TiltX^2) + Mean(TiltY^2)}
  \]
  Where TiltX and TiltY are the tilt angles of the stylus, and the formula calculates the combined mean altitude from these angles.

- **Modulus Azimuth**: 
  \[
  Modulus \ Azimuth = \sqrt{Mean(Azimuth^2)}
  \]
  Where Azimuth is the azimuth angle of the handwriting input.

- **Modulus Altitude**: 
  \[
  Modulus \ Altitude = Mean(|TiltX|) + Mean(|TiltY|)
  \]
  This combines the absolute values of TiltX and TiltY to calculate the modulus of altitude.

- **Number of Strokes**: The total count of continuous handwriting strokes is calculated as the number of times the user touches down and lifts up while drawing.

These features are combined with demographic data (age, gender, grade) and used by the machine learning model for emotion prediction.

## Future Development
1. **Larger Dataset**: Expanding the dataset for better accuracy across different age groups, languages, and cultures.
2. **Feature Expansion**: Adding more handwriting features such as letter shape and word spacing for deeper analysis.
3. **Model Improvement**: Exploring deep learning models (such as CNNs) for improved accuracy in emotion detection.
4. **Real-time Feedback**: Providing real-time emotional feedback as the user writes.

## Project URL
The project is live and can be accessed at: [Handwriting Emotion Detection](https://graphology-emotion-detector-4523ecd5cbab.herokuapp.com/).