'use strict';

/*
 /test
 /api/new
 /api/upload
 /api/list
 /api/update
*/

const express = require('express');
const app = express();
// Reuse express server
const server = require('http').createServer(app);
// Port
const port = process.env.PORT || 8080;
// CORS
const cors = require('cors');

var request = require('superagent')

const socket_port = process.env.PORT || 8000;

const io = require('socket.io')(server)



// Connection to Mongo
// Import?
const dbLib = require('./database/dbLib.js');

const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path')

// HTTP request in req.body as json
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// CORS
app.use(cors());

// Serve static files
//app.use(express.static(__dirname + '/public'));

const Storage = multer.diskStorage({
    destination: "./database/media",
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: Storage }).array("imgUploader", 3);

app.get("/test", function (req, res) {
    res.send("OK!")
});

app.post("/api/apps/new", async function (req, res) {
    const newAppData = {
        folders: [
            {
                name: "Folder1",
                subfolders: [
                    {
                        name: "SubFolder1",
                        content: []
                    }
                ]
            }
        ]
    }
    await dbLib.insertApp(req.body.name, "author", "scenario", "category", newAppData, req.body.drones)
    res.send({ response: "New!" })
});

app.put("/api/apps/update/:id", async function (req, res) {
    await dbLib.updateApp(req.params.id, req.body)
    res.send({ response: "Updated!" })
})

app.post("/api/apps/upload", function (req, res) {
    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.end("Something went wrong uploading content!");
        }
        const { appid, index, subindex } = req.body

        for (let i = 0; i < req.files.length; i++) {
            await dbLib.addAppContent(req.body.appid, index, subindex, req.files[i].filename)
        }
        console.log("Upload complete")
        res.send({ response: "Upload complete!" })
    });
});

app.get("/api/apps/list", async function (req, res) {
    const data = await dbLib.listAllApp();
    res.json(data);
});

app.get("/api/apps/find/:id", async function (req, res) {
    const data = await dbLib.findApp(req.params.id)
    res.json(data);
});

app.get("/api/content/:id", function (req, res) {
    res.sendFile(path.join(__dirname, './database/media', req.params.id));
});

app.get("/api/drones/list", async function (req, res) {
    const data = await dbLib.listAllDrones();
    res.json(data);
});

app.post("/api/drones/new", async function (req, res) {
    await dbLib.insertDrone(req.body.name)
    res.send({ response: "Added "+req.body.name+" to the DB" })
});

// Start server
server.listen(port, async function () {
    console.log('Server listening at port %d', port);
    // Debug
    //await dbLib.dropCol();
    await dbLib.createCol("Dev", "Apps");
    await dbLib.createCol("Dev", "Drones")
});

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
            .send({name: msg.id})
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