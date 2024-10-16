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
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    // Draw predefined lines and cursive template when canvas loads
    drawTemplate(context, canvas.width, canvas.height);

    // Set up the drawing event listeners
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

        // Check if form is valid
        if (!age || !gender || !grade) {
            alert('Please fill out age, gender, and grade.');
            return;
        }

        // Log the data to check the structure
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

    // Helper function to check if the pointer is in the current box (bold or cursive)
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
        const cmToPx = 37.8;  // Conversion from cm to px
        const boxWidth = 14 * cmToPx;
        const boxHeight = 5 * cmToPx;
        const boxAX = 30;
        const boxAY = 30;
        const boxBX = 30;
        const boxBY = boxAY + boxHeight + 30;
        drawBoxA(context, boxAX, boxAY, boxWidth, boxHeight, cmToPx);
        drawBoxB(context, boxBX, boxBY, boxWidth, boxHeight, cmToPx);
    }

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
        context.fillText('Ants build kingdoms', x + 10, y + 3.5 * lineSpacing - 10);  // Adjusted to 4th line
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
        context.setLineDash([5, 5]);
        context.strokeText('Ants build kingdoms', x + 14, y + topLine + midLine - 2.5);
        context.setLineDash([]);
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

    function setupDrawingListeners(canvas, context) {
        var points = [];
        var isDrawing = false;
        var lastTimestamp = null;

        for (const ev of ["touchstart", "mousedown", "pointerdown"]) {
            canvas.addEventListener(ev, function (e) {
                isDrawing = true;
                points = [];
                lastTimestamp = Date.now();
                addDrawingPoint(e, canvas, points);
            });
        }

        for (const ev of ['touchmove', 'mousemove', 'pointermove']) {
            canvas.addEventListener(ev, function (e) {
                if (!isDrawing) return;
                addDrawingPoint(e, canvas, points);
                drawOnCanvas(points);
            });
        }

        for (const ev of ['touchend', 'mouseup', 'pointerup']) {
            canvas.addEventListener(ev, function () {
                isDrawing = false;
                points = [];
                currentBox = currentBox === 'bold' ? 'cursive' : 'bold';
            });
        }
    }

    function addDrawingPoint(e, canvas, points) {
        let pressure = 0.1;
        let x, y;
        let tiltX = 0, tiltY = 0, azimuth = 0;

        if (window.PointerEvent && e.pointerType === 'pen') {
            // For pointer events with pen input, use azimuth and tilt values
            tiltX = e.tiltX;
            tiltY = e.tiltY;
            azimuth = e.azimuthAngle || 0
        } else if (e.touches && e.touches[0]) {
            // For touch events (like on an iPad), get coordinates but no tilt/azimuth data
            x = e.touches[0].pageX - canvas.offsetLeft;
            y = e.touches[0].pageY - canvas.offsetTop;
        } else {
            // For mouse or fallback events, use page coordinates
            x = e.pageX - canvas.offsetLeft;
            y = e.pageY - canvas.offsetTop;
        }

        // Set default values for cases where tilt or azimuth are not supported
        if (!('tiltX' in e) || !('tiltY' in e)) {
            console.warn('TiltX or TiltY is not supported on this device.');
        }
        if (!('azimuthAngle' in e)) {
            console.warn('Azimuth is not supported on this device.');
        }

        // Get pressure for pen or touch events
        if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
            pressure = e.touches[0]["force"] > 0 ? e.touches[0]["force"] : pressure;
            x = e.touches[0].pageX - canvas.offsetLeft;
            y = e.touches[0].pageY - canvas.offsetTop;
        } else if (window.PointerEvent && e.pointerType === 'pen') {
            pressure = e.pressure || 1.0;
            x = e.pageX - canvas.offsetLeft;
            y = e.pageY - canvas.offsetTop;
        } else {
            pressure = 1.0;
            x = e.pageX - canvas.offsetLeft;
            y = e.pageY - canvas.offsetTop;
        }

        const lineWidth = Math.log(pressure + 1) * 2;
        const currentTime = Date.now();
        const timeDifference = currentTime - lastTimestamp;
        const speed = timeDifference > 0 ? Math.sqrt(x * x + y * y) / timeDifference : 0;

        // Log values for debugging
        console.log('Captured TiltX:', tiltX);
        console.log('Captured TiltY:', tiltY);
        console.log('Captured Azimuth:', azimuth);
        console.log('Captured Pressure:', pressure);
        console.log('Captured Speed:', speed);

        points.push({ x, y, lineWidth });

        // Create stroke data object to store all captured attributes
        const strokeData = {
            x,
            y,
            speed,
            timestamp: currentTime,
            pressure: pressure,
            tiltX: tiltX || 0,
            tiltY: tiltY || 0,
            azimuth: azimuth || 0,
            box: currentBox
        };

        // Append strokeData to appropriate drawingData array (bold or cursive)
        if (currentBox === 'bold') {
            drawingData.bold.push(strokeData);
        } else {
            drawingData.cursive.push(strokeData);
        }

        // Update the timestamp for next speed calculation
        lastTimestamp = currentTime;
    }
};

