
const port = process.env.PORT || 8080;
const url = process.env.SOCKET_URL || 'localhost'

const io = require('socket.io-client')
const socket = io(`http://${url}:${port}/drones`);

socket.on('connect', function () {
    console.log("Drone connected");
    socket.emit('init', JSON.stringify({
        id: '123',
        name: 'MyDrone'
    }));
});


socket.on('message', (msg) => {
    console.log(msg)
})
socket.on('event', function (data) {

});
socket.on('disconnect', function () {
    console.log("Drone disconnected")
});