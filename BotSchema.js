'use strict'

const mongoose = require('mongoose')

var BotSchema = mongoose.Schema;

var Bot = new BotSchema ( {
	name : String,
	role : String,
	date_creation : Date,
	proprietaire : String,
	website : String
});

