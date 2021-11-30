// Set up MongoDB
const MongoClient = require('mongodb').MongoClient;

let database;

async function connect(url, dbname) {
    let client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    })
    database = client.db(dbname);
    console.log('Database is connected')
}
function getDB() {
    return database;
}

module.exports = {
    connect, getDB
}
