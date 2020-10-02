var express = require('express');
var app = express();
// var server = app.listen(3333);
var server = app.listen(process.env.PORT || 3333);
var socket = require('socket.io');


// app.get('/', (req, res) => {
//     res.send('<p>Oi gente</p>');
// });

app.use(express.static('client'));

var io = socket(server);

io.sockets.on('connection', (socket) => {
    // console.log(socket);
    console.log(`client ${socket.id} connected to the server`);

    socket.on('mouse', (data) => {
        socket.broadcast.emit('mouse',data); // outros clients
        // io.sockets.emit('mouse',data); // todos os clients
    });

    socket.on('disconnect', () => {
        console.log(`client ${socket.id} disconnect`)
    });

});

