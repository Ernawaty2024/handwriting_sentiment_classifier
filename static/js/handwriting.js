window.onload = function () {
    var canvas = document.getElementById('handwritingCanvas');
    var context = canvas.getContext('2d');
    var isDrawing = false;
    var drawingData = [];
    var points = [];
    var lineWidth = 0;
    var currentBox = 'bold';  // Start with bold tracing

    // Set canvas size
    canvas.width = 600;
    canvas.height = 500;  // Increased height to accommodate both boxes

    // Draw predefined lines and cursive template when canvas loads
    drawTemplate(context, canvas.width, canvas.height);

    // Start drawing when the pointer is pressed down (Apple Pencil supported)
    for (const ev of ["touchstart", "mousedown"]) {
        canvas.addEventListener(ev, function (e) {
            if (isInBox(e, currentBox)) {
                isDrawing = true;
                let pressure = 0.1;
                let x, y;
                if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
                    pressure = e.touches[0]["force"] > 0 ? e.touches[0]["force"] : pressure;
                    x = e.touches[0].pageX - canvas.offsetLeft;
                    y = e.touches[0].pageY - canvas.offsetTop;
                } else {
                    pressure = 1.0;
                    x = e.pageX - canvas.offsetLeft;
                    y = e.pageY - canvas.offsetTop;
                }

                // Adjusted line width to make strokes thinner
                lineWidth = Math.log(pressure + 1) * 10;
                context.lineWidth = lineWidth;
                context.strokeStyle = 'black';
                context.lineCap = 'round';
                context.lineJoin = 'round';

                points.push({ x, y, lineWidth });
                context.beginPath();
                context.moveTo(x, y);
                drawingData.push({
                    x: x,
                    y: y,
                    timestamp: Date.now(),
                    pressure: pressure,
                    tiltX: e.tiltX || 0,
                    tiltY: e.tiltY || 0,
                    azimuth: e.azimuthAngle || 0,
                    box: currentBox
                });
            }
        });
    }

    // Continue drawing and capture data including speed
    for (const ev of ['touchmove', 'mousemove']) {
        canvas.addEventListener(ev, function (e) {
            if (isDrawing && isInBox(e, currentBox)) {
                e.preventDefault();

                let pressure = 0.1;
                let x, y;
                if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
                    pressure = e.touches[0]["force"] > 0 ? e.touches[0]["force"] : pressure;
                    x = e.touches[0].pageX - canvas.offsetLeft;
                    y = e.touches[0].pageY - canvas.offsetTop;
                } else {
                    pressure = 1.0;
                    x = e.pageX - canvas.offsetLeft;
                    y = e.pageY - canvas.offsetTop;
                }

                // Smoothen line width calculation
                lineWidth = (Math.log(pressure + 1) * 10 * 0.2 + lineWidth * 0.8);
                points.push({ x, y, lineWidth });

                // Draw the stroke smoothly
                drawOnCanvas(points);

                drawingData.push({
                    x: x,
                    y: y,
                    timestamp: Date.now(),
                    pressure: pressure,
                    tiltX: e.tiltX || 0,
                    tiltY: e.tiltY || 0,
                    azimuth: e.azimuthAngle || 0,
                    box: currentBox
                });
            }
        });
    }

    // Stop drawing when pointer is lifted
    for (const ev of ['touchend', 'mouseup']) {
        canvas.addEventListener(ev, function () {
            isDrawing = false;
            points = [];
            // Switch to cursive box after finishing bold tracing
            currentBox = currentBox === 'bold' ? 'cursive' : 'bold';
        });
    }

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
        var gender = document.getElementById('gender').value;  // Fixed incorrect field reference
        var grade = document.getElementById('grade').value;

        if (!age || !gender || !grade) {
            alert('Please fill out age, gender, and grade.');
            return;
        }

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
        context.strokeText('Angin bertiup kencang', x + 14, y + topLine + midLine - 2.5);  // Adjusted to sit closer to the second line from the bottom
        context.setLineDash([]);
    }

    // Function to draw on the canvas with smoothing
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
