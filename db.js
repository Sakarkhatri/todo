const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'todolist';

const client = new MongoClient(url, { useUnifiedTopology: true });

client.connect(function(err) {
    if(err){
        console.log(err);
    }else{
        console.log("Connected successfully to DB server");
    }
});

module.exports = {
    client,
    ObjectId,
    dbName
}