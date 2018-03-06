/**
 * Database -> collections -> documents with fields
 */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const dbName = process.env.DB_DATABASE_NAME
const options = process.env.DB_OPTIONS;

// Connection URL
let url
if (username) {
    url = 'mongodb://' + username + ':' + password + '@' + host + '/' + options;
} else {
    url = 'mongodb://' + host + '/' + options
}

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

async function addAppContent(id, folderName, index, content) {
    const field = `appdata.folders.${index}.content`
    const nameField = `appdata.folders.${index}.name`
    const setName = {}
    setName[nameField] = folderName
    const push = {}
    push[field] = content
    console.log("DBlib addapp:", push)
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(appCol);

        const r = await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: setName, $push: push });
        console.log(r.modifiedCount)
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

async function insertDrone(name, onair) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        const col = db.collection(droneCol);
        const result = await col.updateOne({ name: name }, { $set: { name: name, onair: onair } }, { upsert: true });
        if (result.upsertedCount) {
            console.log("DB: New Drone -", name)
        }
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function updateDrone(id, name) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        const col = db.collection(droneCol);
        const result = await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: { name: name } });
        if (result.upsertedCount) {
            console.log("DB: New Drone -", name)
        }
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

        db.collection(appCol).updateMany({}, { $pull: { drones: id } });
        console.log("DB: Delete Drone -", id)
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
    updateDrone: updateDrone,
    listAllDrones: listAllDrones,
    deleteApp: deleteApp,
    deleteDrone: deleteDrone
};