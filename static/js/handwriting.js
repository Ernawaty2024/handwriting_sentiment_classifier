window.onload = function () {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingData = {
        cursive: [],
        bold: []
    };
    var points = [];
    var lineWidth = 0;
    var currentBox = 'bold';  // Start with bold tracing
    var lastTimestamp = null;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 500;  // Increased height to accommodate both boxes

    // Prevent default touch actions to stop screen moving on iPad
    canvas.addEventListener('pointerdown', function (e) {
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('pointermove', function (e) {
        e.preventDefault();
    }, { passive: false });

    // Draw predefined lines and cursive template when canvas loads
    document.fonts.ready.then(function () {
        drawTemplate(context, canvas.width, canvas.height);
    });

    // Set up the drawing event listeners using Pointer Events
    setupDrawingListeners(canvas, context);

    // Clear the canvas and redraw the template
    document.getElementById('clearCanvas').onclick = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTemplate(context, canvas.width, canvas.height);  // Redraw the template
        drawingData = { cursive: [], bold: [] };  // Clear drawing data
        currentBox = 'bold';  // Reset to bold
    };

    // Submit handwriting data
    document.getElementById('submitCanvas').onclick = function () {
        var age = document.getElementById('age').value;
        var gender = document.getElementById('gender').value;
        var grade = document.getElementById('grade').value;

        // Log the handwriting data to check the structure
        console.log('Handwriting Data:', drawingData);
        
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
            headers: { 'Content-Type': 'application/json' },
            body: handwritingData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('predictionResult').innerText = data.error ? `Error: ${data.error}` : `Emotion: ${data.emotion}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('predictionResult').innerText = 'An error occurred';
        });
    };
    
    function setupDrawingListeners(canvas, context) {
        var points = [];
        var isDrawing = false;
        var lastTimestamp = null;

        // Use pointer events instead of touch events for better support of stylus inputs
        canvas.addEventListener('pointerdown', function (e) {
            isDrawing = true;
            points = [];
            lastTimestamp = Date.now();
            addDrawingPoint(e, canvas, points);
        });
        canvas.addEventListener('pointermove', function (e) {
            if (!isDrawing) return;
            addDrawingPoint(e, canvas, points);
            drawOnCanvas(points);
        });
        canvas.addEventListener('pointerup', function () {
            isDrawing = false;
            points = [];
            currentBox = currentBox === 'bold' ? 'cursive' : 'bold';
        });
    }
    function addDrawingPoint(e, canvas, points) {
        let pressure = 0.1;
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;
        let tiltX = e.tiltX || 0;  // Capture tiltX, default to 0 if not supported
        let tiltY = e.tiltY || 0;  // Capture tiltY, default to 0 if not supported
        let azimuth = e.azimuthAngle || 0;  // Capture azimuth, default to 0 if not supported
        if (e.pressure && e.pressure > 0) {
            pressure = e.pressure;
        }
        const lineWidth = Math.log(pressure + 1) * 2;
        const currentTime = Date.now();
        const timeDifference = currentTime - lastTimestamp;
        const speed = timeDifference > 0 ? Math.sqrt(x * x + y * y) / timeDifference : 0;
        // Log azimuth and tilt values to check if they are being captured
        console.log('Azimuth:', azimuth, 'TiltX:', tiltX, 'TiltY:', tiltY, 'Speed:', speed);
        points.push({ x, y, lineWidth });
        const strokeData = {
            x, 
            y,
            speed,
            timestamp: currentTime,
            pressure: pressure,
            tiltX: tiltX,
            tiltY: tiltY,
            azimuth: azimuth,
            box: currentBox
        };
        if (currentBox === 'bold') {
            drawingData.bold.push(strokeData);
        } else {
            drawingData.cursive.push(strokeData);
        }
        
        lastTimestamp = currentTime;
    }

    // Draw the template (boxes for handwriting)
    function drawTemplate(context, width, height) {
        const cmToPx = 37.8;
        const boxWidth = 14 * cmToPx;
        const boxHeight = 5 * cmToPx;
        const boxAX = 30;
        const boxAY = 30;
        const boxBX = 30;
        const boxBY = boxAY + boxHeight + 30;
        drawBoxA(context, boxAX, boxAY, boxWidth, boxHeight, cmToPx);
        drawBoxB(context, boxBX, boxBY, boxWidth, boxHeight, cmToPx);
    }

    // Function to draw the boxes
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
        context.font = '45px Playwrite VN';
        context.textBaseline = 'alphabetic';
        context.fillText('Ants build kingdoms', x + 10, y + 3.5 * lineSpacing - 10);
    }
    
    // Function to draw the cursive box
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
        context.font = '45px Playwrite VN';
        context.textBaseline = 'alphabetic';
        context.setLineDash([5, 5]);  // Dashed line for cursive text
        context.strokeText('Ants build kingdoms', x + 14, y + topLine + midLine - 2.5);
        context.setLineDash([]);  // Reset to solid line after drawing the text
    }
    function drawOnCanvas(stroke) {
        context.strokeStyle = 'black';
        context.lineCap = 'round';
        context.lineJoin = 'round';
        const l = stroke.length - 1;
        if (stroke.length >= 3) {
            const xc = (stroke[l].x + stroke[l - 1].x) / 2;
            const yc = (stroke[l].y + stroke[l - 1].y) / 2;
            context.lineWidth = stroke[l - 1].lineWidth;
            context.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc);
            context.stroke();
            context.beginPath();
            context.moveTo(xc, yc);
        } else {
            const point = stroke[l];
            context.lineWidth = point.lineWidth;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.stroke();
        }
    }
};
