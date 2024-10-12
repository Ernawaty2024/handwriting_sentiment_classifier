window.onload = function () {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingData = [];
    var prevTimestamp, prevX, prevY;
    var currentBox = 'bold';  // Start with bold tracing

    // Set canvas size
    canvas.width = 600;
    canvas.height = 500;  // Increased height to accommodate both boxes

    // Draw predefined lines and cursive template when canvas loads
    drawTemplate(context, canvas.width, canvas.height);

    // Start drawing when the pointer is pressed down (Apple Pencil supported)
    canvas.onpointerdown = function (e) {
        if (isInBox(e, currentBox)) {
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
                azimuth: e.azimuthAngle || 0,  // Stylus azimuth angle
                box: currentBox  // Mark the box type: bold or cursive
            });
        }
    };

    // Continue drawing and capture data including speed
    canvas.onpointermove = function (e) {
        if (isDrawing && isInBox(e, currentBox)) {
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
                azimuth: e.azimuthAngle || 0,  // Azimuth angle
                box: currentBox  // Mark the box type: bold or cursive
            });

            // Update previous position and timestamp for the next calculation
            prevX = currentX;
            prevY = currentY;
            prevTimestamp = currentTimestamp;
        }
    };

    // Stop drawing when pointer is lifted
    canvas.onpointerup = function () {
        isDrawing = false;
    };

    // Clear the canvas and redraw the template
    document.getElementById('clearCanvas').onclick = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate(context, canvas.width, canvas.height);  // Redraw the template
        drawingData = [];  // Clear drawing data
        currentBox = 'bold';  // Reset to bold
    };

    // Submit handwriting data
    document.getElementById('submitCanvas').onclick = function () {
        // Validate the form inputs for age, gender, and grade
        var age = document.getElementById('age').value;
        var gender = document.querySelector('input[name="gender"]:checked');
        var grade = document.getElementById('grade').value;

        if (!age || !gender || !grade) {
            alert('Please fill out age, gender, and grade.');
            return;
        }

        // Prepare the handwriting data to send to the server
        var handwritingData = JSON.stringify({
            handwriting_data: drawingData,
            age: age,
            gender: gender.value,
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
                if (data.error) {
                    document.getElementById('predictionResult').innerText = `Error: ${data.error}`;
                } else {
                    document.getElementById('predictionResult').innerText = `Emotion: ${data.emotion}`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('predictionResult').innerText = 'An error occurred';
            });
    };

    // Helper function to check if the pointer is in the current box
    function isInBox(e, box) {
        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        if (box === 'bold') {
            return (x >= 30 && x <= 30 + 14 * 37.8) && (y >= 30 && y <= 30 + 5 * 37.8);
        } else if (box === 'cursive') {
            return (x >= 30 && x <= 30 + 14 * 37.8) && (y >= 30 + 5 * 37.8 + 30 && y <= 30 + 5 * 37.8 * 2 + 30);
        }
        return false;
    }
};

// Function to draw the handwriting template (both Box A and Box B)
function drawTemplate(context, width, height) {
    const cmToPx = 37.8; // Conversion from cm to px
    const boxWidth = 14 * cmToPx;
    const boxHeight = 5 * cmToPx;

    const boxAX = 30;
    const boxAY = 30;
    const boxBX = 30;
    const boxBY = boxAY + boxHeight + 30;

    // Draw Box A (Bold Tracing)
    drawBoxA(context, boxAX, boxAY, boxWidth, boxHeight, cmToPx);

    // Draw Box B (Cursive Tracing)
    drawBoxB(context, boxBX, boxBY, boxWidth, boxHeight, cmToPx);
}

// Draw box A (Bold tracing)
function drawBoxA(context, x, y, width, height, cmToPx) {
    let lineSpacing = 0.6 * cmToPx;
    let startY = y;

    context.strokeStyle = '#000';
    context.lineWidth = 1;

    // Adjust number of lines and space to properly position the text
    for (let i = 0; i < 6; i++) {
        context.beginPath();
        context.moveTo(x, startY);
        context.lineTo(x + width, startY);
        context.stroke();
        startY += lineSpacing;
    }

    // Bold text should sit on the 4th line
    context.font = '50px Dancing Script';
    context.textBaseline = 'alphabetic';
    context.fillText('Angin bertiup kencang', x + 10, y + 3.5 * lineSpacing - 10);  // Adjusted to 4th line
}

// Draw box B (Cursive tracing)
function drawBoxB(context, x, y, width, height, cmToPx) {
    let topLine = 1.2 * cmToPx;
    let midLine = 0.6 * cmToPx;
    let bottomLine = 1.2 * cmToPx;
    let startY = y;

    context.strokeStyle = '#000';
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x + width, startY);
    context.stroke();

    startY += topLine;
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x + width, startY);
    context.stroke();

    startY += midLine;
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x + width, startY);
    context.stroke();

    startY += bottomLine;
    context.beginPath();
    context.moveTo(x, startY);
    context.lineTo(x + width, startY);
    context.stroke();

    // Adjust dotted cursive text to be properly aligned with the lines
    context.font = '50px Dancing Script';
    context.textBaseline = 'alphabetic';
    context.setLineDash([5, 5]);
    context.strokeText('Angin bertiup kencang', x + 15, y + topLine + midLine - 3);  // Adjusted to sit closer to the second line from the bottom
    context.setLineDash([]);
}
