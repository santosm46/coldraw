
var cor = '#0000ff';
var slider;
var previous;
// const MAX_HIST_SIZE = 1500000;

var socket;
var lineSize;
var canvas;
var localHistory = [];
let colorPicker;

// const color = {
// 	r: Math.random()*255,
// 	g: Math.random()*255,
// 	b: Math.random()*200
// };

function mudaCor(event) {
	cor = event.target.value;
}

function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(960, 540);
	ellipseMode(CENTER);
	
	slider = document.getElementById("myRange");
	lineSize = parseInt(slider.value);

	canvas = createGraphics(width, height);
	canvas.ellipseMode(CENTER);
	clearCanvas();
	canvas.noStroke();

	colorPicker = document.querySelector('input');
	colorPicker.addEventListener('input', mudaCor);
	// colorPicker = createGraphics(width, height);
	// drawPallete();


	// colorPicker = createColorPicker("blue");
    // colorPicker.position(width + 10, 0);

	socket = io.connect();
	socket.on('mouse', newDrawing);
	socket.on('history', updateHistory);

}


function draw() {
	lineSize = parseInt(slider.value);

	image(canvas, 0, 0);
	fill(cor);
	ellipse(mouseX, mouseY, lineSize, lineSize);
}

function drawCircle(circle) {
	if(!circle) {
		console.error(`param circle is null`);
		return;
	}
	
	if(circle.checkpoint) {
		previous = circle;
		// canvas.fill(circle.color);
		// canvas.ellipse(circle.x, circle.y, circle.lineSize/2, circle.lineSize/2);
	}
	if(previous) {
		canvas.stroke(circle.color);
		canvas.strokeWeight(circle.lineSize);
		canvas.line(previous.x, previous.y, circle.x, circle.y);
	}
	else {
		console.error(`var previous is null`);
	}
	previous = circle;
	
}

function drawOnBoard(checkpoint) {
	drawCircle({color:cor, x:mouseX, y:mouseY, lineSize, checkpoint});

	const data = {
		x: mouseX,
		y: mouseY,
		lineSize: lineSize,
		rgb: color,
		color: cor,
		checkpoint: checkpoint
	};

	socket.emit('mouse', data);
}

function mouseDragged() {
	if(!mouseOnBoard()) return;
	drawOnBoard(false);
}

function mousePressed() {
	if(!mouseOnBoard()) return;
	// socket.emit('mark checkpoint', {});
	drawOnBoard(true);
}

// function mouseReleased() {
// 	print('mouse foi solto');
// }

function newDrawing(data) {
	drawCircle(data);
}

function updateHistory(history) {
	localHistory = history;
	drawHistory();
}

function clearCanvas() {
	canvas.background(255);
}

function drawHistory() {
	clearCanvas();
	for(let ball of localHistory) {
		drawCircle(ball);
	}
}

function mouseOnBoard() {
	if(mouseX < 0) return false;
	if(mouseY < 0) return false;
	if(mouseX > width) return false;
	if(mouseY > height) return false;
	return true;
}

function limitHistory() {
    const percent = 0.2; // percent of history to remove
    const length = localHistory.length;

    if(length >= MAX_HIST_SIZE) {
        localHistory = localHistory.slice(parseInt(length * percent), length);
    }
}

function undo() {
	socket.emit('undo', {});
}

function keyPressed() {
	// console.log(keyCode);
	if(keyIsDown(90) && keyIsDown(CONTROL)) {
		print("Ctrl+z");
		undo();
	}
	// if (keyCode === 90 && evtobj.ctrlKey) alert("Ctrl+z");
}

// function drawPallete() {

// 	for(let i=0; i<255; i++) {
// 		for(let j=0; j<255; j++) {
// 			colorPicker.stroke(i, j, 150);
// 			colorPicker.point(i, j);
// 		}
// 	}

	
// }

