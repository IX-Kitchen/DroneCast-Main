/**
 * Database -> collections -> documents with fields
 */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const port = process.env.DB_PORT
const dbName = process.env.DB_DATABASE_NAME
const options = process.env.DB_OPTIONS

// Connection URL
let url
if (username) {
    url = `mongodb://${username}:${password}@${host}:${port}/${options}`
    //url = 'mongodb://' + username + ':' + password + '@' + host + '/' + options;
} else {
    url = 'mongodb://' + host + '/' + options
}

// Collection name
const appCol = 'Apps'
const displayCol = "Displays"
// Schema
const appSchema = require('./AppSchema');
const displaySchema = require('./DisplaySchema');

async function testConnection() {
    try {
        const client = await MongoClient.connect(url);
        console.log("dbLib: Connected successfully to database");
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
async function testError() {
    throw Error("Test error")
}
async function createCol(dbName, colName) {
    var schema;

    switch (colName) {
        case "Apps":
            schema = appSchema
            break
        case "Displays":
            schema = displaySchema
            break
        default:
            schema = appSchema
    }
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        let col = await db.createCollection(colName)
        // let col = await db.createCollection(colName, {
        //     validator: schema
        // })
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

async function updateAppData(id, appdata) {
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

async function updateAppDisplays(id, displays) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = db.collection(appCol);
        await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: { displays: displays } });
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function addAppContent(id, index, content) {
    const field = `appdata.folders.${index}.content`
    //const nameField = `appdata.folders.${index}.name`
    //const setName = { [nameField]: folderName }
    const push = { [field]: content }
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(appCol);

        //const r = await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: setName, $push: push });
        const r = await col.updateOne({ _id: mongo.ObjectID(id) }, { $addToSet: push });
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteAppContent(id, index, content) {
    const field = `appdata.folders.${index}.content`
    const pull = { [field]: [content] }
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(appCol);

        const r = await col.updateOne({ _id: mongo.ObjectID(id) }, { $pullAll: pull });
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}
async function addAppCode(index, id, folder, path, folderName, file) {
    const field = `appdata.folders.${index}.content`
    const nameField = `appdata.folders.${index}.name`
    const setName = { [nameField]: folderName }
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const col = db.collection(appCol);
        const push = { [field]: path }
        const r1 = await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: setName, $addToSet: push })

        // if (path) {
        //     // Exists js, css folder?
        //     const r1 = await col.count({ _id: mongo.ObjectID(id), [`${field}.${path}`]: { $exists: true } })
        //     if (r1 === 0) {
        //         const push = { [field]: { [path]: [file] } }
        //         await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: setName, $push: push });
        //     } else {
        //         const push = { [`${field}.$.${path}`]: file}
        //         await col.updateOne({ _id: mongo.ObjectID(id), [`${field}.${path}`]: { $exists: true } },
        //             { $set: setName, $addToSet: push }
        //         );
        //     }
        // } else {
        //     const push = { [field]: file }
        //     const r = await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: setName, $addToSet: push });
        // }
        client.close();
    } catch (err) {
        console.log(err);
    }
}

async function newApp(name, author, scenario, category, appdata, displays) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let r = await db.collection(appCol).insertOne(
            {
                name: name, date: new Date(), author: author,
                scenario: scenario, category: category, appdata: appdata, displays: displays
            }
        );
        assert.equal(1, r.insertedCount);
        client.close();
        return r.ops[0]._id
    } catch (err) {
        console.log(err.stack);
    }
}

async function insertDisplay(name, onair) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        const col = db.collection(displayCol);
        const result = await col.updateOne({ name: name }, { $set: { name: name, onair: onair } }, { upsert: true });
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function updateDisplay(id, name) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        const col = db.collection(displayCol);
        const result = await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: { name: name } });
        if (result.upsertedCount) {
            console.log("DB: New Display -", name)
        }
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
    // Change name in appdata
}

async function listAllDisplays() {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let col = db.collection(displayCol);
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

async function deleteDisplay(id) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(displayCol);

        let r = await col.deleteOne({ name: id });
        assert.equal(1, r.deletedCount);

        db.collection(appCol).updateMany({}, { $pull: { displays: id } });
        console.log("DB: Delete Display -", id)
        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

module.exports = {
    testConnection: testConnection,
    testError: testError,
    createCol: createCol,
    newApp: newApp,
    dropCol: dropCol,
    listAllApp: listAllApp,
    findApp: findApp,
    updateAppData: updateAppData,
    addAppContent: addAppContent,
    deleteAppContent: deleteAppContent,
    addAppCode: addAppCode,
    insertDisplay: insertDisplay,
    updateDisplay: updateDisplay,
    listAllDisplays: listAllDisplays,
    deleteApp: deleteApp,
    deleteDisplay: deleteDisplay,
    updateAppDisplays: updateAppDisplays
};