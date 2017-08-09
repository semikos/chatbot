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

BotSchema.path('name').required(true);
BotSchema.path('role').required(true);
BotSchema.path('date_creation').required(true);
BotSchema.path('proprietaire').required(true);
BotSchema.path('website').required(true);

