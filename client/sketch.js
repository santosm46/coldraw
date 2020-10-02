
var cor = 'blue';
var slider;
// const MAX_HIST_SIZE = 1500000;

var socket;
var lineSize;
var canvas;
var localHistory = [];

const color = {
	r: Math.random()*255,
	g: Math.random()*255,
	b: Math.random()*200
};

function mudaCor(novaCor) {
	cor = novaCor;
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

function drawCircle(color, posX, posY, size) {
	canvas.fill(color);
	canvas.ellipse(posX, posY, size, size);
}

function drawOnBoard() {
	drawCircle(cor, mouseX, mouseY, lineSize);

	const data = {
		x: mouseX,
		y: mouseY,
		lineSize: lineSize,
		rgb: color,
		color: cor,
		checkpoint: false
	};

	socket.emit('mouse', data);
}

function mouseDragged() {
	if(!mouseOnBoard()) return;
	drawOnBoard();
}

function mousePressed() {
	if(!mouseOnBoard()) return;
	print('mouse pressionado');
	socket.emit('mark checkpoint', {});
	drawOnBoard();
}

// function mouseReleased() {
// 	print('mouse foi solto');
// }

function newDrawing(data) {
	drawCircle(data.color, data.x, data.y, data.lineSize);
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
		drawCircle(ball.color, ball.x, ball.y, ball.lineSize);
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


