// ********************************    #draw#    ******************************

// draw a line then send it to server
function drawFromThisClient(checkpoint) {

    const endPoint = {
		x: mouseX,
		y: mouseY,
    };
    
    // console.log(`endPoint.id: ${endPoint.id}, socket.id: ${socket.id}`);
    // if(!previous) {
    //     previous = endPoint;
    // }
    if(checkpoint) {
        previous = endPoint;
    }
    const point = {id: socket.id, start:previous, end:endPoint};
    point.lineSize = lineSize;
	point.color = cor;
	point.checkpoint = checkpoint;

    drawLine(point, true);
    previous = endPoint;
    
    socket.emit('mouse draw', point);
}



function clearCanvas() {
	canvas.background(255);
}

function drawLine(line) {
    // line starts at checkpoint
    let start = line.start;
    let end = line.end;
    if(line.checkpoint || (!start)) {
		start = end;
    }
    if(!end) {console.log("end point of line is null"); return;} 

    canvas.stroke(line.color);
	canvas.strokeWeight(line.lineSize);
	canvas.line(start.x, start.y, end.x, end.y); // ..., circle
}

function drawHistory() {
	if(!state.history) {
		console.error("state.history is null");
		return;
	}
	clearCanvas();
	for(let i=0; i<state.history.length; i++) {
		drawLine(state.history[i]);
	}
}

