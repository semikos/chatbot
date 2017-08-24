'use strict'
const token = process.env.FB_PAGE_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const assert = require('assert')

var mongo = require('./mongo.js')

var exports = module.exports = {};
exports.getUser = function (sender, callback) {
	var chaine ="";
	request({
		url: 'https://graph.facebook.com/v2.6/'+sender+'?access_token='+token,
		method: 'GET',
		json: true
	}, function(err, response, body) {
		if (body['gender'] === 'male') {
			chaine += "M. "
		}
		else if (body['gender'] === 'female') {
			chaine += "Mme. "
		}
		chaine += body['first_name'];
		mongo.addUser(body);
		callback(chaine);
	});
};