/**
 * Database -> collections -> documents with fields
 */

const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'myDB';
// Collection name
const colName = 'myCol'
// Schema
const schema = require('./AppSchema');

async function createCol(name) {
    let client;
    try {
        client = await MongoClient.connect(url);
        let db;
        if (name) {
            db = client.db(name);
        } else {
            db = client.db(dbName);
        }
        let col = await db.createCollection(colName, {
            validator: schema
        })
        assert.equal(colName, col.collectionName);
    } catch (err) {
        console.log(err.stack);
    }
    if (client) {
        client.close();
    }
}

async function listAll() {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let col = db.collection(colName);
        let data = await col.find().toArray();
        client.close();
        return data;
    } catch (err) {
        console.log(err.stack);
    }
}

async function find(id) {
    try {
        const client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let col = db.collection(colName);
        let data = await col.findOne(mongo.ObjectID(id));
        client.close();
        return data;
    } catch (err) {
        console.log(err.stack);
    }
}

async function update(id, appdata) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(colName);

        await col.updateOne({ _id: mongo.ObjectID(id) }, { $set: { appdata: appdata } });

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function addContent(id, index, subindex, content) {
    console.log("add",id,index,subindex,content)
    const query = "appdata.folders." + index + ".subfolders." + subindex + ".content"
    const push = {}
    push[query] = content
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const col = db.collection(colName);

        col.updateOne({ _id: mongo.ObjectID(id) }, { $push: push });

        client.close();
    } catch (err) {
        console.log(err.stack);
    }
}

async function insert(name, author, scenario, category, appdata) {
    let client;
    try {
        client = await MongoClient.connect(url);
        let db = client.db(dbName);
        let r = await db.collection(colName).insertOne(
            { name: name, date: new Date(), author: author, scenario: scenario, category: category, appdata: appdata }
        );
        assert.equal(1, r.insertedCount);
        client.close();
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

        let exists = await db.listCollections({ name: colName }).next();
        if (exists) {
            await db.collection(colName).drop();
        }
    } catch (err) {
        console.log(err.stack);
    }
    if (client) {
        client.close();
    }
}

module.exports = {
    createCol: createCol,
    insert: insert,
    dropCol: dropCol,
    listAll: listAll,
    find: find,
    update: update,
    addContent: addContent
};