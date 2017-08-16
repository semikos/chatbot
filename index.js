'use strict'

const token = process.env.FB_PAGE_TOKEN
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN

const apiaiApp = require('apiai')(process.env.CLIENT_ACCESS_TOKEN)
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const Templates = require('./templates/template.js')
const mongo = require('mongodb').MongoClient;
const assert = require('assert')
var chaine = "";

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === vtoken) {
        res.send(req.query['hub.challenge'])
    }
    // res.send('No sir')
	res.send('token='+token+'vtoken:'+vtoken)
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

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
		var cursor = db.collection('bot-data').find();
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			resultArray.push(doc);
			res.send(doc);
		}, function (){
			db.close();
		})
	})
});

facebookDemarre();

// Posting to the webhook and Facebook messenger application.
app.post('/webhook/', function (req, res) {
	facebookMenu();
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
		var event = req.body.entry[0].messaging[i]
		var sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text 
			if (text === 'Generic') {
				sendGenericMessage()
				continue
			}
			else if (text.toUpperCase() === 'Menu'.toUpperCase() || (text.toUpperCase().indexOf('help'.toUpperCase()) !== -1)
				|| (text.toUpperCase().indexOf('neuf'.toUpperCase()) !== -1) || (text.toUpperCase().indexOf('bot'.toUpperCase()) !== -1)) {
				sendMenuMessage(sender, event, token)
				continue
			}
			sendApiMessage(event)
		}
		if (event.postback && event.postback.payload) {
			var x = "";
			getUser(sender, function(val) {
				x = val;
			});
			sendTextMessage(sender, event.postback.payload+"   x:"+x, token);
			continue
		}
    }
	res.sendStatus(200)
})

// Send echo message.
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function getUser(sender, callback) {
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
		sendTextMessage(sender, "Salut "+chaine);
	});
	return callback(chaine);
};

function sendGenericMessage() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
        qs: {access_token:token},
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
		form: Templates.defaulttemplates["Menu"]
    }, 
	function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Print out the response body
			console.log(": Updated.");
			console.log(body);
		} else {
			//Handle errors
			console.log(": Failed. Need to handle errors.");
			console.log(body);
		}
	})
}

function sendMenuMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Adecco France",
                    "image_url":"https://pbs.twimg.com/media/ClfMG1HWEAAl_EM.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com/t/adecco.france",
                        "title": "Acces"
                    }],
                }, {
                    "title": "Drift BOT",
                    "image_url": "https://i.ytimg.com/vi/AHsspE09SvU/maxresdefault.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.drift.com",
                        "title": "Acces"
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//Send message using API.AI
function sendApiMessage(event) {
	let text = event.message.text 
  let apiai = apiaiApp.textRequest(text, {
    sessionId: vtoken // use any arbitrary id
  });

    apiai.on('response', (response) => {
  let aiText = response.result.fulfillment.speech;

    request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: token},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: {text: aiText}
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
    });
	console.log(aiText)
 });

  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}

// Menu button.
function facebookMenu(){
    request(
    {
      url: 'https://graph.facebook.com/v2.6/me/thread_settings',
	  qs: {access_token: token},
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      form: Templates.defaulttemplates["Menu"]
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          console.log(": Updated.");
          console.log(body);
      } else {
          //  Handle errors
          console.log(": Failed. Need to handle errors.");
          console.log(body);
      }
	});
}

// Get Started button.
function facebookDemarre(){
	request({
		url: 'https://graph.facebook.com/v2.6/me/thread_settings',
		qs: {access_token: token},
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		form:Templates.defaulttemplates["Demarrer"]
	},
	function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(": Updated.");
			console.log(body);
		} else {
			console.log(": Failed. Need to handle errors.");
			console.log(body);
		}
	});
}

function discussionButtons(sender){	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: token},
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		json: {
			recipient: {id: sender},
			message: {
					"quick_replies": [{
						"content_type":"text",
						"title":"Red",
						"payload":"You Selected Red",
						"image_url":"http://www.colorcombos.com/colors/FF0000"
					}]
			}
		}
	},
	function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(": Updated.");
			console.log(body);
		} else {
			console.log(": Failed. Need to handle errors.");
			console.log(body);
		}
	});
}