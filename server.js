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

// HTTP request in req.body as json
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true }));

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

app.post("/api/new", async function (req, res) {
    await dbLib.insert(req.body.name, "author","scenario","category", {"folders": []})
    res.send({response: "New!"})

});

app.put("/api/update/:id", async function (req, res){
    await dbLib.update(req.params.id, req.body)
    res.send({response: "Updated!"})
})

app.post("/api/upload", function (req, res) {
    console.log("Post")
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return res.end("Something went wrong uploading content!");
        }
        for (let i=0; i<req.files.length; i++){
            
            dbLib.insert(req.files[i].filename,"author","scenario","category");
        }
        console.log("Upload complete")
        res.send({response: "Upload complete!"})
    });
});

app.get("/api/list", async function (req, res) {
    const data = await dbLib.listAll();
    res.json(data);
});

app.get("/api/find/:id", async function (req, res) {
    const data = await dbLib.find(req.params.id)
    res.json(data);
});

// Start server
server.listen(port, async function () {
    console.log('Server listening at port %d', port);
    // Debug
    //await dbLib.dropCol();
    await dbLib.createCol();
});