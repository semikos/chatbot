'use strict'
const token = process.env.FB_PAGE_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const mongo = require('mongodb').MongoClient;
const assert = require('assert')
const fb = require('./facebook.js');

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

app.get('/get-data', function(req, res, next) {
	var resultArray = [];
	mongo.connect(url, function(err,db) {
		assert.equal(null, err);
		var cursor = db.collection('user-data').find();
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			request({
				url: 'https://graph.facebook.com/v2.6/me/messages',
				qs: {access_token:token},
				method: 'POST',
				json: {
					recipient: {id:doc['id']},
					message: "Hello",
				}
			}, function(error, response, body) {
				if (error) {
					console.log('Error sending messages: ', error)
				} else if (response.body.error) {
					console.log('Error: ', response.body.error)
				}
			})
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

