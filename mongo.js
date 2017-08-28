'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const mongo = require('mongodb').MongoClient;
const assert = require('assert')

var url = "mongodb://chatbotcybex:chatbotcybex123@bot-shard-00-00-ccjjw.mongodb.net:27017,bot-shard-00-01-ccjjw.mongodb.net:27017,bot-shard-00-02-ccjjw.mongodb.net:27017/bots?ssl=true&replicaSet=Bot-shard-0&authSource=admin";

var item = {
	name : "Adecco",
	role : "Assistant Financier",
	website : "www.google.com"
};

mongo.connect(url, function (err,db) {
	assert.equal(null, err);
	console.log(item);
});

app.get('/get-data/', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err,db) {
		assert.equal(null, err);
		var cursor = db.collection('user-data').find();
		cursor.forEach(function(err, doc) {
			assert.equal(null, err);
			resultArray.push(doc);
			res.send(doc);
			console.log(doc)
		}, function (){
			db.close();
		})
	})
});

var exports = module.exports = {};
exports.addUser = function (user) {
	mongo.connect(url, function (err, db) {
		assert.equal(null, err);
		db.collection('user-data').insert(user, function() {
			db.close();
		});
	});
}

