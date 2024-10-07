window.onload = function() {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var handwritingData = []; // Store handwriting data here
    var isDrawing = false;
    var prevTimestamp, prevX, prevY;

    // Conversion factor from cm to pixels (1 cm = ~37.8 pixels)
    const cmToPx = 37.8;

    // Set canvas size (13.5 cm width x (3 cm + 1.2 cm space + 3 cm) height)
    canvas.width = 13.5 * cmToPx;  // 13.5 cm width
    canvas.height = (3 + 1.2 + 3) * cmToPx;  // Total height including space between boxes

    // Draw Box A and Box B when canvas loads
    drawBoxA(context, 0, 0, 13.5 * cmToPx, 3 * cmToPx, cmToPx);
    drawBoxB(context, 0, (3 + 1.2) * cmToPx, 13.5 * cmToPx, 3 * cmToPx, cmToPx);

    // Handle mouse down
    canvas.onpointerdown = function(e) {
        isDrawing = true;
        prevTimestamp = Date.now();
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        handwritingData.push({
            x: prevX,
            y: prevY,
            timestamp: prevTimestamp,
            pressure: e.pressure || 0.5,  // Apple Pencil pressure
            tiltX: e.tiltX || 0,          // Tilt in X-axis
            tiltY: e.tiltY || 0,          // Tilt in Y-axis
            azimuth: e.azimuthAngle || 0  // Azimuth angle
        });
        context.beginPath();
        context.moveTo(prevX, prevY);
    };

    // Handle mouse move
    canvas.onpointermove = function(e) {
        if (isDrawing) {
            var currentTimestamp = Date.now();
            var currentX = e.clientX - canvas.offsetLeft;
            var currentY = e.clientY - canvas.offsetTop;
            var timeDiff = (currentTimestamp - prevTimestamp) / 1000;  // Time in seconds
            var distance = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
            var speed = distance / timeDiff;

            context.lineTo(currentX, currentY);
            context.stroke();

            handwritingData.push({
                x: currentX,
                y: currentY,
                timestamp: currentTimestamp,
                speed: speed,
                pressure: e.pressure || 0.5,
                tiltX: e.tiltX || 0,
                tiltY: e.tiltY || 0,
                azimuth: e.azimuthAngle || 0
            });

            prevX = currentX;
            prevY = currentY;
            prevTimestamp = currentTimestamp;
        }
    };

    // Handle mouse up
    canvas.onpointerup = function() {
        isDrawing = false;
    };

    // Clear canvas
    document.getElementById('clearCanvas').onclick = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoxA(context, 0, 0, 13.5 * cmToPx, 3 * cmToPx, cmToPx);
        drawBoxB(context, 0, (3 + 1.2) * cmToPx, 13.5 * cmToPx, 3 * cmToPx, cmToPx);
        handwritingData = [];  // Clear stored data
    };

    // Submit handwriting data to Flask
    document.getElementById('submitCanvas').onclick = function() {
        fetch('/submit_handwriting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(handwritingData)
        })
        .then(response => response.json())
        .then(data => {
            // Show the prediction result on the page
            document.getElementById('predictionResult').innerText = `Predicted Emotion: ${data.emotion}`;
        })
        .catch(error => console.error('Error:', error));
    };
};

// Functions to draw the handwriting template (Box A and Box B)
function drawBoxA(context, x, y, width, height, cmToPx) {
    let lineSpacing = 0.6 * cmToPx;
    let startY = y;

    context.strokeStyle = '#000';
    context.lineWidth = 1;

    for (let i = 0; i < 6; i++) {
        context.beginPath();
        context.moveTo(x, startY);
        context.lineTo(x + width, startY);
        context.stroke();
        startY += lineSpacing;
    }

    context.font = '50px Dancing Script';
    context.textBaseline = 'alphabetic';
    context.fillText('Ants build kingdoms', x + 10, y + 4 * lineSpacing - 5);
}

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

    context.font = '50px Dancing Script';
    context.textBaseline = 'alphabetic';
    context.setLineDash([1,3]);
    context.strokeText('Ants build kingdoms', x + 10, y + topLine + midLine - 5);
    context.setLineDash([]);
}
