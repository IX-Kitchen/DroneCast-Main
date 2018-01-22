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
const server = require('http').Server(app);
// Port
const port = process.env.PORT || 8080;
// CORS
const cors = require('cors');

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
    res.send({ response: "New Drone!" })
});

// Start server
server.listen(port, async function () {
    console.log('Server listening at port %d', port);
    // Debug
    //await dbLib.dropCol();
    await dbLib.createCol("Dev", "Apps");
    await dbLib.createCol("Dev", "Drones")
});