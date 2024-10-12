window.onload = function() {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingData = [];
    var prevTimestamp, prevX, prevY;
    var currentBox = 'bold';  // Start with bold tracing

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
            pressure: e.pressure || 0.5,
            tiltX: e.tiltX || 0,
            tiltY: e.tiltY || 0,
            azimuth: e.azimuthAngle || 0,
            box: currentBox
        });
    };

    // Continue drawing and capture data including speed
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

            drawingData.push({
                x: currentX,
                y: currentY,
                timestamp: currentTimestamp,
                speed: speed,
                pressure: e.pressure || 0.5,
                tiltX: e.tiltX || 0,
                tiltY: e.tiltY || 0,
                azimuth: e.azimuthAngle || 0,
                box: currentBox
            });

            prevX = currentX;
            prevY = currentY;
            prevTimestamp = currentTimestamp;
        }
    };

    canvas.onpointerup = function() {
        isDrawing = false;
        currentBox = currentBox === 'bold' ? 'cursive' : 'bold';
    };

    document.getElementById('clearCanvas').onclick = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate(context, canvas.width, canvas.height);
        drawingData = [];
        currentBox = 'bold';
    };

    document.getElementById('submitCanvas').onclick = function() {
        var age = document.getElementById('age').value;
        var gender = document.querySelector('input[name="gender"]:checked');
        var grade = document.getElementById('grade').value;

        if (!age || !gender || !grade) {
            alert('Please fill out age, gender, and grade.');
            return;
        }

        var handwritingData = JSON.stringify({
            handwriting_data: drawingData,
            age: age,
            gender: gender.value,
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
            if (data.error) {
                document.getElementById('emotionResult').innerText = `Error: ${data.error}`;
            } else {
                document.getElementById('emotionResult').innerText = `Emotion: ${data.emotion}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('emotionResult').innerText = 'An error occurred';
        });
    };
};
