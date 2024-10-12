window.onload = function() {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingDataBold = [];
    var drawingDataCursive = [];
    var isCursive = false;
    var prevTimestamp, prevX, prevY;

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

        let currentData = {
            x: prevX,
            y: prevY,
            timestamp: prevTimestamp,
            pressure: e.pressure || 0.5,
            tiltX: e.tiltX || 0,
            tiltY: e.tiltY || 0,
            azimuth: e.azimuthAngle || 0
        };

        if (isCursive) {
            drawingDataCursive.push(currentData);
        } else {
            drawingDataBold.push(currentData);
        }
    };

    // Continue drawing and capture data
    canvas.onpointermove = function(e) {
        if (isDrawing) {
            var currentTimestamp = Date.now();
            var currentX = e.clientX - canvas.offsetLeft;
            var currentY = e.clientY - canvas.offsetTop;
            var timeDifference = (currentTimestamp - prevTimestamp) / 1000;
            var distance = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
            var speed = distance / timeDifference;

            context.lineTo(currentX, currentY);
            context.stroke();

            let currentData = {
                x: currentX,
                y: currentY,
                timestamp: currentTimestamp,
                speed: speed,
                pressure: e.pressure || 0.5,
                tiltX: e.tiltX || 0,
                tiltY: e.tiltY || 0,
                azimuth: e.azimuthAngle || 0
            };

            if (isCursive) {
                drawingDataCursive.push(currentData);
            } else {
                drawingDataBold.push(currentData);
            }

            prevX = currentX;
            prevY = currentY;
            prevTimestamp = currentTimestamp;
        }
    };

    // Stop drawing when pointer is lifted
    canvas.onpointerup = function() {
        isDrawing = false;
        // Switch to cursive after bold
        isCursive = !isCursive;
    };

    // Clear the canvas and reset
    document.getElementById('clearCanvas').onclick = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate(context, canvas.width, canvas.height);
        drawingDataBold = [];
        drawingDataCursive = [];
        isCursive = false; // Reset to bold mode
    };

    // Submit handwriting data
    document.getElementById('submitCanvas').onclick = function() {
        let handwritingData = JSON.stringify({
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            grade: document.getElementById('grade').value,
            bold: drawingDataBold,
            cursive: drawingDataCursive
        });

        fetch('/submit_handwriting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: handwritingData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('predictionResult').innerText = `Emotion: ${data.emotion}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
};

// Draw the template (lines and text) for handwriting guidance
function drawTemplate(context, width, height) {
    const topLineY = 80;
    const middleLineY = 140;
    const bottomLineY = 200;

    context.strokeStyle = '#000';
    context.lineWidth = 1;

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

    context.font = '30px Dancing Script';
    context.fillText('Ants build kingdoms', 40, middleLineY - 10);
    context.setLineDash([5, 5]);
    context.strokeText('Ants build kingdoms', 40, bottomLineY - 10);
    context.setLineDash([]);
}
