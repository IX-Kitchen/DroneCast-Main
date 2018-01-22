'use strict'
var request = require('superagent')

const port = process.env.PORT || 8000;

const server = require('http').createServer();
const io = require('socket.io')(server);

var avDrones = new Map()

const dronesIo = io.of('/drones'),
    apps = io.of('/clients');

dronesIo.on('connection', (socket) => {
    console.log("Drone connected");

    socket.on('message', (msg) => {
        console.log("From Drone to server:", msg);
        //apps.emit('message',msg)
    });

    socket.on('init', (msg) => {
        console.log("Init msg from drone:", msg)
        if (typeof msg === 'string'){
            msg = JSON.parse(msg)
        }
        avDrones.set(msg.id, socket)
        request
            .post('http://localhost:8080/api/drones/new')
            .send({name: msg.name})
            .then((response) => {
                console.log(response.body.response)
            })
            .catch((error) => {
                console.log(error)
            })
    })
});
apps.on('connection', (socket) => {
    console.log("Client connected");

    socket.on('message', (msg) => {
        console.log("From client to server:", msg);
    });
    socket.on('data', (msg) => {
        console.log("Data sent from client to drone:", msg)
        const { drones } = msg // Drones bound to the app
        for (let key of avDrones.keys()) {
            drones.forEach(drone => {
                if (drone === key) {
                    const sock = avDrones.get(key)
                    sock.emit('message', msg.content)
                }
            });
        }
    })
});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});