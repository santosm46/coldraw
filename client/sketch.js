
let cor = '#0000ff';
let slider;
// const MAX_HIST_SIZE = 1500000;

let socket;
let lineSize;
let canvas;
let colorPicker;
// let mouses = {};
let state = {};
// let otherClients;
let myId;
let previous = null;

const OUTER_BOARD = 50;


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

	socket = io.connect();


	socket.on('mouse draw', drawLine);
	socket.on('mouse move', updateMouseRing);
	socket.on('updated state', updateState);

	myId = socket.id;


}

function updateState(newState) {
	if(newState.clients) {
		state.clients = newState.clients;
	}

	if(newState.mouseRings) {
		state.mouseRings = newState.mouseRings;
	}

	if(newState.history) {
		state.history = newState.history;
		drawHistory();
	}
}

function draw() {
	lineSize = parseInt(slider.value);

	image(canvas, 0, 0);

	showMouseRings();

	fill(cor);
	ellipse(mouseX, mouseY, lineSize, lineSize);
}

function limitHistory() {
    const percent = 0.2; // percent of history to remove
    const length = state.history.length;

    if(length >= MAX_HIST_SIZE) {
        state.history = state.history.slice(parseInt(length * percent), length);
    }
}

function undo() {
	socket.emit('undo', {});
}

function keyPressed() {
	if(keyIsDown(90) && keyIsDown(CONTROL)) {
		undo();
	}
}


