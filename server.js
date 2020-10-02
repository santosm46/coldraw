var express = require('express');
var app = express();
// var server = app.listen(3333);
var server = app.listen(process.env.PORT || 3333);
var socket = require('socket.io');

const MAX_HIST_SIZE = 1500000;
const history = [];

app.use(express.static('client'));

var io = socket(server);

function limitHistory() {
    const percent = 0.2; // percent of history to remove
    const length = history.length;

    if(length >= MAX_HIST_SIZE) {
        history = history.slice(parseInt(length * percent), length);
    }
}

io.sockets.on('connection', (socket) => {
    // console.log(socket);
    console.log(`client ${socket.id} connected to the server`);

    socket.emit('history', history);

    socket.on('mouse', (data) => {
        history.push(data);
        limitHistory();
        socket.broadcast.emit('mouse',data); // outros clients
        // io.sockets.emit('mouse',data); // todos os clients
    });

    socket.on('disconnect', () => {
        console.log(`client ${socket.id} disconnect`)
    });

});

