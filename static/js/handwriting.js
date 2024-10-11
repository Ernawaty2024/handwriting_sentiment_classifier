<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Handwriting Data Collection</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600&display=swap');

        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .canvas-box {
            border: 1px solid #000;
            display: inline-block;
            margin-bottom: 20px;  /* Space between canvas and buttons */
        }
        button {
            margin: 10px; /* Adds space between the buttons */
            padding: 10px 20px;
            background-color: #333;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #555;
        }
        #capturedData, #predictionResult {
            margin-top: 20px;
            text-align: left;
            white-space: pre-wrap; /* Display JSON data properly */
        }
    </style>
</head>
<body>
    <h1>Handwriting Data Collection</h1>
    <h2>Write on the Canvas</h2>
    <p>Trace over the solid and dotted text to simulate handwriting</p>
    <p>Only use iPad and Apple Pencil</p>

    <div class="canvas-box">
        <canvas id="handwritingCanvas" width="600" height="300"></canvas>
    </div>
    
    <!-- Adjusted: Buttons are moved below the canvas and spaced out -->
    <div>
        <button id="clearCanvas">Clear</button>
        <button id="submitCanvas">Submit Handwriting</button>
    </div>

    <!-- Divs for displaying captured data and prediction -->
    <h3>Captured Data</h3>
    <pre id="capturedData"></pre> <!-- Displays the captured handwriting data -->

    <h3>Prediction Result</h3>
    <p id="predictionResult"></p> <!-- Displays the prediction result -->

    <script src="{{ url_for('static', filename='js/handwriting.js') }}"></script>
</body>
</html>
