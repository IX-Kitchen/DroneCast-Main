'use strict';

/*
 /test
 /api/new
 /api/contentUpload
 /api/list
 /api/update
*/

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const app = express();
// Reuse express server
const server = require('http').createServer(app);
// Port
const port = process.env.BACKEND_PORT || 8080;
// CORS
const cors = require('cors');

const io = require('socket.io')(server)


// Connection to Mongo
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
// URL/id/drone
app.use(express.static(__dirname + '/database/apps'));

const fs = require('fs');

// Upload content
const contentStorage = multer.diskStorage({
    destination: "./database/media",
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const contentUpload = multer({ storage: contentStorage }).array("imgUploader", 3);

// Upload App's HTML
const appStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dir = "./database/apps"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir = `${dir}/${req.body.appid}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir = `${dir}/${req.body.folder}`
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        //console.log("Server appstorage", req.body, file)
        cb(null, dir)
    },
    filename: function (req, file, callback) {
        if (file.mimetype === 'text/html') {
            file.originalname = 'index.html'
        }
        callback(null, file.originalname);
    }
});

const appUpload = multer({ storage: appStorage }).array("appUploader", 5);

app.get("/test", function (req, res, next) {
    res.send("OK!")
});

app.post("/api/apps/new", async function (req, res) {
    try {
        await dbLib.insertApp(req.body.name, "author", "scenario", "category", req.body.appData, req.body.drones)
    } catch (error) {
        next(error)
    }
    res.send({ response: "New!" })
});

app.put("/api/apps/update/:id", async function (req, res) {
    try {
        await dbLib.updateApp(req.params.id, req.body)
    } catch (error) {
        next(error)
    }
    res.send({ response: "Updated!" })
})

app.post("/api/apps/appupload", function (req, res) {
    appUpload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.end("Something went wrong Uploading the app!");
        }
        const { appid, folder, folderName, index } = req.body
        for (let i = 0; i < req.files.length; i++) {
            await dbLib.addAppCode(index, appid, folder, folderName, req.files[i].filename)
        }
        res.send({ response: "contentUpload complete!" })
    });
});

app.post("/api/apps/upload", function (req, res) {
    contentUpload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.end("Something went wrong contentUploading content!");
        }
        const { appid, index, folderName } = req.body
        for (let i = 0; i < req.files.length; i++) {
            await dbLib.addAppContent(appid, folderName, index, req.files[i].filename)
        }
        res.send({ response: "contentUpload complete!" })
    });
});

app.get("/api/apps/list", async function (req, res) {
    try {
        const data = await dbLib.listAllApp();
        res.json(data);
    } catch (error) {
        next(error)
    }
});

app.get("/api/apps/find/:id", async function (req, res) {
    try {
        const data = await dbLib.findApp(req.params.id)
        res.json(data);
    } catch (error) {
        next(error)
    }
});

app.get("/api/content/:id", function (req, res) {
    res.sendFile(path.join(__dirname, './database/media', req.params.id));
});

app.get("/api/drones/list", async function (req, res) {
    try {
        const data = await dbLib.listAllDrones();
        res.json(data);
    } catch (error) {
        next(error)
    }
});

app.post("/api/drones/new", async function (req, res) {
    if (req.body) {
        try {
            await dbLib.insertDrone(req.body.name, false)
            res.send({ response: "Added " + req.body.name + " to the DB" })
        } catch (error) {
            next(error)
        }

    } else {
        next(new Error('Error on adding a drone'))
    }
});

app.put("/api/drones/edit/:id", async function (req, res) {
    if (req.body) {
        try {
            await dbLib.updateDrone(req.params.id, req.body.name)
            res.send({ response: "Drone " + req.params.id + " updated" })
        } catch (error) {
            next(error)
        }
    } else {
        next(new Error('Error on adding a drone'))
    }
});

app.delete("/api/apps/delete/:id", async function (req, res) {
    try {
        await dbLib.deleteApp(req.params.id)
        res.send({ response: "App deleted" })
    } catch (error) {
        next(error)
    }

})
app.delete("/api/drones/delete/:id", async function (req, res) {
    try {
        await dbLib.deleteDrone(req.params.id)
        res.send({ response: "Drone deleted" })
    } catch (error) {
        next(error)
    }

})

// Last middleware - No response - 404
app.use(function (req, res, next) {
    res.status(404);
    res.send({ error: 'Route not defined' });
});

// Error handling
app.use(function (error, req, res, next) {
    res.json({ message: error.message });
});

// Start server
server.listen(port, async function () {
    console.log('Server listening at port %d', port, "in", process.env.NODE_ENV);
    // Debug
    //await dbLib.dropCol();
    await dbLib.createCol("Dev", "Apps");
    await dbLib.createCol("Dev", "Drones")
});

// Socket logic
var avDrones = new Map()

const dronesIo = io.of('/drones'), apps = io.of('/clients');

dronesIo.on('connection', (socket) => {
    console.log("Drone connected");

    socket.on('message', (msg) => {
        console.log("From Drone to server:", msg);
        //apps.emit('message',msg)
    });

    socket.on('init', (msg) => {
        if (typeof msg === 'string') {
            msg = JSON.parse(msg)
        }
        console.log("SOCKET_DRONE: Init msg from drone:", msg.id)
        dbLib.insertDrone(msg.id, true)
        avDrones.set(msg.id, socket)
    })

    socket.on('disconnect', (reason) => {
        for (let [key, value] of avDrones.entries()) {
            if (value.id === socket.id) {
                dbLib.insertDrone(key, false)
                avDrones.delete(key)
                return
            }
        }
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