'use strict'

const port = process.env.PORT || 8000;
const url = process.env.SOCKET_URL || 'localhost'

const io = require('socket.io-client')
const socket = io(`http://${url}:${port}/clients`);

socket.on('connect', function () {
    console.log("Client connected");
    socket.emit('data', {
        drones: ['123'],
        content: 'MyContent URL'
    });
});


socket.on('message', (msg) => {
    console.log(msg)
})
socket.on('event', function (data) {

});
socket.on('disconnect', function () {
    console.log("Client disconnected")
});