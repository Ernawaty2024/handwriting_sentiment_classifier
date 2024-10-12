window.onload = function() {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingData = [];
    var prevTimestamp, prevX, prevY;
    var currentBox = 'bold'; // Track whether user is drawing in bold or cursive box

    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;

    // Draw predefined lines and cursive template when canvas loads
    drawTemplate(context, canvas.width, canvas.height);

    // Start drawing when the pointer is pressed down (Apple Pencil supported)
    canvas.onpointerdown = function(e) {
        isDrawing = true;
        prevTimestamp = Date.now();
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        context.beginPath();
        context.moveTo(prevX, prevY);
        drawingData.push({
            x: prevX,
            y: prevY,
            timestamp: prevTimestamp,
            pressure: e.pressure || 0.5,  // Pressure from Apple Pencil (default 0.5 for non-pen)
            tiltX: e.tiltX || 0,          // Stylus tilt in X-axis
            tiltY: e.tiltY || 0,          // Stylus tilt in Y-axis
            azimuth: e.azimuthAngle || 0, // Stylus azimuth angle
            box: currentBox               // Track which box is being drawn in
        });
    };

    // Continue drawing and capture data including speed
    canvas.onpointermove = function(e) {
        if (isDrawing) {
            var currentTimestamp = Date.now();
            var currentX = e.clientX - canvas.offsetLeft;
            var currentY = e.clientY - canvas.offsetTop;

            // Calculate time difference
            var timeDifference = (currentTimestamp - prevTimestamp) / 1000;  // Time in seconds
            
            // Calculate distance traveled using Euclidean distance
            var distance = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
            
            // Calculate speed (distance / time)
            var speed = distance / timeDifference;

            // Draw the stroke
            context.lineTo(currentX, currentY);
            context.stroke();

            // Capture drawing data with speed, pressure, tilt, and azimuth
            drawingData.push({
                x: currentX,
                y: currentY,
                timestamp: currentTimestamp,
                speed: speed,
                pressure: e.pressure || 0.5,  // Pressure from Apple Pencil
                tiltX: e.tiltX || 0,          // Tilt in X-axis
                tiltY: e.tiltY || 0,          // Tilt in Y-axis
                azimuth: e.azimuthAngle || 0, // Azimuth angle
                box: currentBox               // Track which box is being drawn in (bold/cursive)
            });

            // Update previous position and timestamp for the next calculation
            prevX = currentX;
            prevY = currentY;
            prevTimestamp = currentTimestamp;
        }
    };

    // Stop drawing when pointer is lifted
    canvas.onpointerup = function() {
        isDrawing = false;
    };

    // Clear the canvas and redraw the template
    document.getElementById('clearCanvas').onclick = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate(context, canvas.width, canvas.height);  // Redraw the template
        drawingData = [];  // Clear drawing data
        currentBox = 'bold';  // Reset box to bold
    };

    // Submit handwriting data
    document.getElementById('submitCanvas').onclick = function() {
        var age = document.getElementById('age').value;
        var gender = document.getElementById('gender').value;
        var grade = document.getElementById('grade').value;

        // Prepare the handwriting data to send to the server
        var handwritingData = JSON.stringify({
            handwriting_data: drawingData,
            age: age,
            gender: gender,
            grade: grade
        });

        // Send the data via fetch API to the back-end
        fetch('/submit_handwriting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: handwritingData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('predictionResult').innerText = `Prediction Result: ${data.emotion}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('predictionResult').innerText = `Error: ${error}`;
        });
    };
};

// Function to draw the handwriting template
function drawTemplate(context, width, height) {
    const topLineY = 80;
    const middleLineY = 140;
    const bottomLineY = 200;

    context.strokeStyle = '#000';  // Black for predefined lines
    context.lineWidth = 1;

    // Draw horizontal lines for writing guidance
    context.beginPath();
    context.moveTo(30, topLineY);
    context.lineTo(width - 30, topLineY);
    context.stroke();

    context.moveTo(30, middleLineY);
    context.lineTo(width - 30, middleLineY);
    context.stroke();

    context.moveTo(30, bottomLineY);
    context.lineTo(width - 30, bottomLineY);
    context.stroke();

    // Draw example cursive text in the middle line (solid)
    context.font = '30px Dancing Script';
    context.fillText('Ants build kingdoms', 40, middleLineY - 10);

    // Draw dotted version of the text as a tracing guide for cursive
    context.setLineDash([5, 5]);  // Set dash pattern for dotted line
    context.strokeText('Ants build kingdoms', 40, bottomLineY - 10);

    context.setLineDash([]);  // Reset dash to default (solid line)
}
