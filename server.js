var express = require('express');
var app = express();
// var server = app.listen(3333);
var server = app.listen(process.env.PORT || 3333);
var socket = require('socket.io');

const MAX_HIST_SIZE = 1500000;
var history = [];
var mouses = {};

app.use(express.static('client'));

var io = socket(server);

function limitHistory() {
    const percent = 0.2; // percent of history to remove
    const length = history.length;

    if(length >= MAX_HIST_SIZE) {
        history = history.slice(parseInt(length * percent), length);
    }
}

function connectClient(client) {
    mouses[client.id] = {id: client.id};
}

function disconnectClient(client) {
    delete mouses[client.id];
}

io.sockets.on('connection', (socket) => {
    // console.log(socket);
    connectClient({id:socket.id});
    console.log(`client ${socket.id} connected to the server`);


    socket.emit('history', history);

    socket.on('mouse', (data) => {
        history.push(data);
        limitHistory();
        socket.broadcast.emit('mouse',data); // outros clients
    });

    socket.on('undo', (data) => {
        let partToRemove = 0;
        for (let i = history.length-1; i >=0; i--) {
            if(history[i].checkpoint) {
                partToRemove = i;
                break;
            }
        }
        // console.log(`deleting history[${partToRemove}:${history.length}]`);
        history = history.slice(0, partToRemove);
        io.sockets.emit('history',history); // todos os clients
    });

    socket.on('mark checkpoint', (data) => {
        if(history.length === 0) return;
        history[history.length-1].checkpoint = true;
    });

    socket.on('mouse move', (data) => {
        mouses[socket.id] = data;
        socket.broadcast.emit('mouse move',mouses);
    });

    socket.on('disconnect', () => {
        disconnectClient({id:socket.id});
        console.log(`client ${socket.id} disconnect`);
    });

});

