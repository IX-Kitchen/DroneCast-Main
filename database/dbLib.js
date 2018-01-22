/**
 * Database -> collections -> documents with fields
 */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'Dev';
// Collection name
const appCol = 'Apps'
const droneCol = "Drones"
// Schema
const appSchema = require('./AppSchema');
const droneSchema = require('./DroneSchema');

async function createCol(dbName, colName) {
    var schema;

    switch (colName) {
        case "Apps":
            schema = appSchema
            break
        case "Drones":
            schema = droneSchema
            break
        default:
            schema = appSchema
    }
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        let col = await db.createCollection(colName, {
            validator: schema
        })
        assert.equal(colName, col.collectionName);
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function listAllApp() {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let col = db.collection(appCol);
        let data = await col.find().toArray();
        client.close();
        return data;
    } catch (err) {
        console.log(err.stack);
    }
}

async function findApp(id) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let col = db.collection(appCol);
        let data = await col.findOne(mongo.ObjectID(id));
        client.close();
        return data;
    } catch (err) {
        console.log(err.stack);
    }
}

async function updateApp(id, appdata) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(appCol);

        await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: { appdata: appdata } });

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function addAppContent(id, index, subindex, content) {
    const query = "appdata.folders." + index + ".subfolders." + subindex + ".content"
    const push = {}
    push[query] = content
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(appCol);

        col.updateOne({ _id: mongo.ObjectID(id) }, { $push: push });

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function insertApp(name, author, scenario, category, appdata, drones) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let r = await db.collection(appCol).insertOne(
            {
                name: name, date: new Date(), author: author,
                scenario: scenario, category: category, appdata: appdata, drones: drones
            }
        );
        assert.equal(1, r.insertedCount);
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function insertDrone(name) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        const col = db.collection(droneCol);
        col.updateOne({ name: name }, { $set: { name: name } }, { upsert: true });
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function listAllDrones() {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let col = db.collection(droneCol);
        let data = await col.find().toArray();
        client.close();
        return data;
    } catch (err) {
        console.log(err.stack);
    }
}

async function dropCol(name) {
    let client;
    try {
        client = await MongoClient.connect(url);
        let db;
        if (name) {
            db = client.db(name);
        } else {
            db = client.db(dbName);
        }

        let exists = await db.listCollections({ name: appCol }).next();
        if (exists) {
            await db.collection(appCol).drop();
        }
    } catch (err) {
        console.log(err.stack);
    }
    if (client) {
        client.close();
    }
}

async function deleteApp(id) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        let col = db.collection(appCol);

        let r = await col.deleteOne({ _id: mongo.ObjectID(id) });
        assert.equal(1, r.deletedCount);

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function deleteDrone(id) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(droneCol);

        let r = await col.deleteOne({ name: id });
        assert.equal(1, r.deletedCount);

        db.collection(appCol).updateMany({}, { $pull: { drones: id }});

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

module.exports = {
    createCol: createCol,
    insertApp: insertApp,
    dropCol: dropCol,
    listAllApp: listAllApp,
    findApp: findApp,
    updateApp: updateApp,
    addAppContent: addAppContent,
    insertDrone: insertDrone,
    listAllDrones: listAllDrones,
    deleteApp: deleteApp,
    deleteDrone: deleteDrone
};