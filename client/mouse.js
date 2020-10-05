// ********************************    #mouse#    ******************************


function emitMouseMove() {
	socket.emit('mouse move', {id: socket.id, mouseX, mouseY, lineSize});
}



function mouseDragged() {
	emitMouseMove();
	if(!mouseOnBoard()) return;
	drawFromThisClient(checkpoint=false);
}

function mousePressed() {
	if(!mouseOnBoard()) return;
	drawFromThisClient(checkpoint=true);
}

function mouseReleased() {
	socket.emit('mouse released', {});
}

function updateMouseRing(mouseRing) {
	const id = mouseRing.id;
	state.mouseRings[id] = mouseRing;
}

function showMouseRings() {
	noFill();
	for (var clientId in state.mouseRings) {
		const mouse = state.mouseRings[clientId];
		if(mouse.id === socket.id) continue;
		ellipse(mouse.mouseX, mouse.mouseY, mouse.lineSize, mouse.lineSize);
	}
}

function mouseMoved() {
	emitMouseMove();
	return false;
}

function mouseOnBoard() {
	if(mouseX < -OUTER_BOARD) return false;
	if(mouseY < 0) return false;
	if(mouseX > width+OUTER_BOARD) return false;
	if(mouseY > height+OUTER_BOARD) return false;
	return true;
}



