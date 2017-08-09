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

Schema.path('name').required(true);
Schema.path('role').required(true);
Schema.path('date_creation').required(true);
Schema.path('proprietaire').required(true);
Schema.path('website').required(true);

