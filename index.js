'use strict'
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const mongo = require('mongodb').MongoClient;
const assert = require('assert')

var facebook = require('./facebook.js')


app.set('port', (process.env.PORT || 5000))

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// For Facebook verification
app.get('/webhook/', facebook.VerificationToken)

// Posting to the webhook and Facebook messenger application.
app.post('/webhook/', facebook.postMessages)

var url = "mongodb://chatbotcybex:chatbotcybex123@bot-shard-00-00-ccjjw.mongodb.net:27017,bot-shard-00-01-ccjjw.mongodb.net:27017,bot-shard-00-02-ccjjw.mongodb.net:27017/bots?ssl=true&replicaSet=Bot-shard-0&authSource=admin";

app.get('/getdata', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err,db) {
		assert.equal(null, err);
		
		var collection = db.collection('user-data');
		collection.find({}).toArray(function(err, docs) {
			assert.equal(err, null);
			console.log("Found the following records");
			console.dir(docs);
		});
	})
});

facebook.facebookDemarre();
facebook.facebookMenu();