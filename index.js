'use strict'
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
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

// for Facebook verification
app.get('/webhook/', facebook.VerificationToken)

// Posting to the webhook and Facebook messenger application.
app.post('/webhook/', facebook.postMessages)

facebook.facebookDemarre();
facebook.facebookMenu();