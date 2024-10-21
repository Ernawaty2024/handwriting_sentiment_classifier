# Handwriting Sentiment Classifier

Handwriting-Sentiment-Classifier captures handwriting data (speed, pressure, azimuth, and altitude) from a web canvas and uses machine learning (Random Forest) to predict the writer's emotion. The data is captured using a drawing interface and processed on the backend for predictions.

## Table of Contents
* [Project Overview](#project-overview)
* [Website Instructions](#[<code style ="color:blue">[Handwriting Emotion Detection](https://graphology-emotion-detector-4523ecd5cbab.herokuapp.com/)</code>website-instructions](https://github.com/Ernawaty2024/handwriting_sentiment_classifier/edit/main/README.md#handwriting-emotion-detection-website-instructions))
* [Files](#files)
* [Project Tree](#project-tree)
* [Business View](#business-view)
* [Limitations](#limitations)
* [Future Improvements](#future-improvements)
* [Ethical Considerations](#ethical-considerations)
* [Credit](#credit)
* [Group Members](#group-members)

## Project Overview
The Handwriting Emotion Detection project leverages graphology to predict emotional states from handwriting data. By collecting key features such as pressure, speed, tilt, and stroke types (cursive and bold), it predicts the emotion of the writer using a trained machine learning model, specifically a Random Forest classifier.

Handwriting can reveal crucial insights into an individual's motor skills and emotional state. This data explores handwriting features to assess a child's Fine Motor Skills (FMS) and emotions while writing. This data collection encompasses two distinct handwriting tasks: sentence bolding and word copying.

Three psychologists use these tasks to observe children's expressions and movements, enabling a comprehensive analysis of their emotional responses and FMS proficiency during the writing process. The resulting handwriting dataset comprises seven variables and three target data collected from 98 elementary students aged 6 to 9.

## <code style ="color:blue">[Handwriting Emotion Detection](https://graphology-emotion-detector-4523ecd5cbab.herokuapp.com/)</code> Website Instructions
1. **Select Age, Gender, and Grade**: Users must input their demographic information.
2. **Handwriting Input**: The user writes on the canvas. Two boxes are provided: one for bold strokes and one for cursive.
3. **Submit**: Once the user has completed their handwriting input, the data is processed and sent to the back-end for emotion prediction.
4. **Clear**: To clear out the writing canvas.
5. **Result**: The predicted emotion is displayed on the screen.

## Files
- **<code style ="color:blue">[index.html](C:\Users\Ernie\Documents\GitHub\handwriting_sentiment_classifier\templates\index.html)</code>**: The front-end page for collecting user data (age, gender, grade) and handwriting samples.
- **<code style ="color:blue">[handwriting.js](C:\Users\Ernie\Documents\GitHub\handwriting_sentiment_classifier\static\js\handwriting.js)</code>**: JavaScript logic for handling the drawing canvas and capturing handwriting data.
- **<code style ="color:blue">[Flask back-end](C:\Users\Ernie\Documents\GitHub\handwriting_sentiment_classifier\app.py)</code>**: Python Flask framework for handling predictions.
- **<code style ="color:blue">[fine_tuned_rf_model.joblib](C:\Users\Ernie\Documents\GitHub\handwriting_sentiment_classifier\fine_tuned_rf_model.joblib)</code>**: Pre-trained Random Forest model for emotion detection.
- **<code style ="color:blue">[style.css](C:\Users\Ernie\Documents\GitHub\handwriting_sentiment_classifier\static\css\style.css)</code>**: CSS for styling the web application.

## Project Tree
handwriting_sentiment_classifier\
├── data\
│   └── handwriting_data.json\
├── Resources\
├── static\
│   ├── css\
│   │   └── style.css\
│   ├── js\
│   │   └── handwriting.js\
├── templates\
│   └── index.html\
├── .gitignore\
├── app.py\
├── fine_tuned_rf_model.joblib\
├── ModelData.ipynb\
├── Procfile\
├── requirements.txt

## Business View
Handwriting analysis has a wide range of potential applications in education, mental health, and security. In this project, emotional prediction from handwriting could be utilized in the following scenarios:
- **Educational Assessment**: Detecting student stress or anxiety levels from handwriting patterns during tests.
- **Mental Health Monitoring**: Identifying emotional distress based on changes in handwriting characteristics.
- **Forensic Analysis**: Using handwriting data as part of forensic investigations to assess emotional states of suspects or individuals.

## Limitations
1. **Small Dataset**: The model is trained on a limited dataset, which might reduce its generalizability across different handwriting styles.
2. **Overfitting**:
Shows perfect accuracy on both training and test sets - model may not generalize well to unseen data
3. **Specific Device Requirements**:
The accurate measurement of pressure, altitude, and azimuth requires the use of specialized devices. 


## Future Improvements
1. **Feature Engineering**:
Explore additional features from handwriting, such as signature traits, spacing, and curvature, to improve prediction power
2. **Real-time Handwriting Analysis**:
Develop the model to work in real-time applications, where users can submit handwriting samples via digital devices for instant emotion detection
3. **Integration with Other Tools**:
Integrate the handwriting emotion detection model with other mental health tools for a comprehensive emotional health assessment

## Ethical Considerations
The research prioritized careful and ethical conduct throughout the study. Approval was obtained from the National and Political Unity Agency and the Education Office of Jember Regency, confirming adherence to established research ethics guidelines. Ethical clearance was also granted by the Institutional Review Board of the education authorities.

## Credit
The datasets used for training gand testing the model are publicly available from <code style ="color:blue">[Mendeley Data](https://data.mendeley.com/datasets/jkdxpvcb23/1)</code>. 

## Group Members
Ernawaty Ernawaty; Rachel Chuang; Yao Xiao


