var cor = 'blue';
var slider;

var socket;
// const porta = '3333';
var lineSize = 25;
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
	background(200);
	noStroke();
	ellipseMode(CENTER);

	// socket = io.connect('http://localhost:3333');
	socket = io.connect();

	socket.on('mouse', newDrawing);
	slider = document.getElementById("myRange");
}

function newDrawing(data) {
	// fill(data.color.r, data.color.g, data.color.b);
	fill(data.color);
	ellipse(data.x, data.y, data.lineSize, data.lineSize);

}

function mouseDragged() {

	// fill(color.r, color.g, color.b);
	fill(cor);
	lineSize = parseInt(slider.value);
	ellipse(mouseX, mouseY, lineSize, lineSize);
	// console.log(100 + slider.value);

	const data = {
		x: mouseX,
		y: mouseY,
		lineSize: lineSize,
		rgb: color,
		color: cor
	};

	socket.emit('mouse', data);
}

function draw() {

}