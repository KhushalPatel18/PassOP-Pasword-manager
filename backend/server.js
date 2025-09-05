const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(cors());

client.connect();

//get all passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
})

//save a password
app.post('/', express.json(), async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const insertResult = await collection.insertOne(password);
    res.send({success: true, result: insertResult});
})

//delete a password by id
app.delete('/', express.json(), async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const deleteResult = await collection.deleteOne(password);
    res.send({success: true, result: deleteResult});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})