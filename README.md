# Handwriting Sentiment Classifier

Handwriting-Sentiment-Classifier captures handwriting data (speed, pressure, azimuth, and altitude from a web canvas and uses machine learning (Random Forest) to predict the writers's emotion. The data is captured using a drawing interfaxe and processed on the backend for predictions.

## Table of Contents
* [Project Overview](#starproject-overview)
* [Website Instructions](#star2usage-instructions)
* [Files](#blue_heartfiles)
* [Business View](#green_heartbusiness-view)
* [Limitations](#wavelimitations)
* [Future Improvements](#purple_heartfuture-improvements)
* [Ethical Considerations](#yellow_heartethical-considerations)
* [Group Members](#snowflake_group_members)

### :star:Project Overview
The Handwriting Emotion Detection project leverages graphology to predict emotional states from handwriting data. By collecting key features such as pressure, speed, tilt, and stroke types (cursive and bold), it predicts the emotion of the writer using a trained machine learning model, specifically a Random Forest classifier.

Handwriting can reveal crucial insights into an individual's motor skills and emotional state. This data explores handwriting features to assess a child's Fine Motor Skills (FMS) and emotions while writing. This data collection encompasses two distinct handwriting tasks: sentence bolding and word copying. 

Three psychologists use these tasks to observe children's expressions and movements, enabling a comprehensive analysis of their emotional responses and FMS proficiency during the writing process. The resulting handwriting dataset comprises seven variables and three target data collected from 98 elementary students aged 6 to 9. 

### :star2: <code style ="color:blue">[Handwriting Emotion Detection](https://graphology-emotion-detector-4523ecd5cbab.herokuapp.com/)</code>Website Instructions
1. **Select Age, Gender, and Grade**: Users must input their demographic information.
2. **Handwriting Input**: The user writes on the canvas. Two boxes are provided: one for bold strokes and one for cursive.
3. **Submit**: Once the user has completed their handwriting input, the data is processed and sent to the back-end for emotion prediction.
4. **Clear**: To clear out the writing canvas.
5. **Result**: The predicted emotion is displayed on the screen.



### :computer:Files
- **index.html**: The front-end page for collecting user data (age, gender, grade) and handwriting samples.
- **handwriting.js**: JavaScript logic for handling the drawing canvas and capturing handwriting data.
- **Flask back-end**: Python Flask framework for handling predictions.
- **optimized_rf_model.joblib**: Pre-trained Random Forest model for emotion detection.
- **style.css**: CSS for styling the web application.

### :green_heart:Business View
Handwriting analysis has a wide range of potential applications in education, mental health, and security. In this project, emotional prediction from handwriting could be utilized in the following scenarios:
- **Educational Assessment**: Detecting student stress or anxiety levels from handwriting patterns during tests.
- **Mental Health Monitoring**: Identifying emotional distress based on changes in handwriting characteristics.
- **Forensic Analysis**: Using handwriting data as part of forensic investigations to assess emotional states of suspects or individuals.

### :wave:Limitations
1. **Small Dataset**: The model is trained on a limited dataset, which might reduce its generalizability across different handwriting styles.
2. **Handwriting Variability**: Handwriting characteristics can vary significantly across cultures and individual habits, which may affect prediction accuracy.
3. **Limited Feature Scope**: Only basic handwriting features such as speed, pressure, tilt, and stroke count are considered. More complex analysis such as letter formation or overall style is not yet included.

### :purple_heart:Future Improvements
1. **Larger Dataset**: Expanding the dataset for better accuracy across different age groups, languages, and cultures.
2. **Feature Expansion**: Adding more handwriting features such as letter shape and word spacing for deeper analysis.
3. **Model Improvement**: Exploring deep learning models (such as CNNs) for improved accuracy in emotion detection.
4. **Real-time Feedback**: Providing real-time emotional feedback as the user writes.

### :yellow_heart:Ethical Considerations
The research prioritized careful and ethical conduct throughout the study. Approval was obtained from the National and Political Unity Agency and the Education Office of Jember Regency, confirming adherence to established research ethics guidelines. Ethical clearance was also granted by the Institutional Review Board of the education authorities.

# :snowflake:Group Members
Ernawaty Ernawaty; Rachel Chuang; Yao Xiao
