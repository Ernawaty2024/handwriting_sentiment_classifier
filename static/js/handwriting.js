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
    // Prevent default touch actions to stop screen moving on iPad
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });
    // Draw predefined lines and cursive template when canvas loads
    drawTemplate(context, canvas.width, canvas.height);
    // Set up the drawing event listeners (new function)
    setupDrawingListeners(canvas, context);
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
        var gender = document.getElementById('gender').value;
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
            console.log("Server Response:", data);  // Log the server response
            if (data.error) {
                document.getElementById('predictionResult').innerText = `Error: ${data.error}`;
            } else {
                document.getElementById('predictionResult').innerText = `Emotion: ${data.emotion}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);  // Log any errors encountered
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
    // Define the function to set up drawing event listeners
    function setupDrawingListeners(canvas, context) {
        var points = [];
        var isDrawing = false;
        for (const ev of ["touchstart", "mousedown"]) {
            canvas.addEventListener(ev, function (e) {
                isDrawing = true;
                points = [];
                // Add initial points when drawing starts
                addDrawingPoint(e, canvas, points);
            });
        }
        for (const ev of ['touchmove', 'mousemove']) {
            canvas.addEventListener(ev, function (e) {
                if (!isDrawing) return;
                addDrawingPoint(e, canvas, points);
                drawOnCanvas(points);  // Draw the points on the canvas
            });
        }
        for (const ev of ['touchend', 'mouseup']) {
            canvas.addEventListener(ev, function () {
                isDrawing = false;
            });
        }
    }
    // Helper function to add points to the drawing array and adjust pressure
    function addDrawingPoint(e, canvas, points) {
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
        const lineWidth = Math.log(pressure + 1) * 2;  // Adjusting line width based on pressure
        
        points.push({ x, y, lineWidth });
        
        // Push this drawing data to the global `drawingData` array for storage
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
};
