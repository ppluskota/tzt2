var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Dane do połączenia w adresie URL
var url = 'mongodb://pawko:asd123@ds245687.mlab.com:45687/tzt02';
var mongodb;

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Nawiązano połączenie z serwerem");
    mongodb = db;
    module.exports = mongodb;
});
