window.onload = function () {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingData = [];
    var prevTimestamp, prevX, prevY;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 300;

    // Draw template when canvas loads
    drawTemplate(context, canvas.width, canvas.height);

    // Start drawing
    canvas.onpointerdown = function (e) {
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
            pressure: e.pressure || 0.5,
            tiltX: e.tiltX || 0,
            tiltY: e.tiltY || 0,
            azimuth: e.azimuthAngle || 0
        });
    };

    // Continue drawing
    canvas.onpointermove = function (e) {
        if (isDrawing) {
            var currentTimestamp = Date.now();
            var currentX = e.clientX - canvas.offsetLeft;
            var currentY = e.clientY - canvas.offsetTop;

            var timeDifference = (currentTimestamp - prevTimestamp) / 1000;
            var distance = Math.sqrt(Math.pow(currentX - prevX, 2) + Math.pow(currentY - prevY, 2));
            var speed = distance / timeDifference;

            context.lineTo(currentX, currentY);
            context.stroke();

            drawingData.push({
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

    // Stop drawing
    canvas.onpointerup = function () {
        isDrawing = false;
    };

    // Clear canvas
    document.getElementById('clearCanvas').onclick = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate(context, canvas.width, canvas.height);
        drawingData = [];
    };

    // Submit handwriting
    document.getElementById('submitCanvas').onclick = function () {
        var age = document.getElementById('age').value;
        var gender = document.getElementById('gender').value;
        var grade = document.getElementById('grade').value;

        var handwritingData = JSON.stringify({
            drawingData: drawingData,
            age: age,
            gender: gender,
            grade: grade
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
                document.getElementById('predictionResult').innerText = `Prediction: ${data.emotion}`;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
};

// Draw template
function drawTemplate(context, width, height) {
    context.strokeStyle = '#000';
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(30, 80);
    context.lineTo(width - 30, 80);
    context.stroke();

    context.moveTo(30, 140);
    context.lineTo(width - 30, 140);
    context.stroke();

    context.moveTo(30, 200);
    context.lineTo(width - 30, 200);
    context.stroke();

    context.font = '30px Dancing Script';
    context.fillText('Cursive: Ants build kingdoms', 40, 130);

    context.setLineDash([5, 5]);
    context.strokeText('Bold: Ants build kingdoms', 40, 190);
    context.setLineDash([]);
}
