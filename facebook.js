'use strict'
const token = process.env.FB_PAGE_TOKEN
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN

const apiaiApp = require('apiai')(process.env.CLIENT_ACCESS_TOKEN)
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const mongo = require('mongodb').MongoClient;
const mongoJS = require('./mongo.js');
const assert = require('assert')
const schedule = require('node-schedule')
const classe = require('./User.js');

var url = "mongodb://chatbotcybex:chatbotcybex123@bot-shard-00-00-ccjjw.mongodb.net:27017,bot-shard-00-01-ccjjw.mongodb.net:27017,bot-shard-00-02-ccjjw.mongodb.net:27017/bots?ssl=true&replicaSet=Bot-shard-0&authSource=admin";

var Templates = require('./template.js')
var graphapi = require('./graphapi.js')


function VerificationToken(req, res) {
    if (req.query['hub.verify_token'] === vtoken) {
        res.send(req.query['hub.challenge'])
    }
    // res.send('No sir')
	res.send('token='+token+'vtoken:'+vtoken)
}

function postMessages (req, res) {
	//Scheduled Messages
	var rule = new schedule.RecurrenceRule();
	rule.dayOfWeek = 1;
	rule.hour = 8;
	rule.minute = 0;
	var j = schedule.scheduleJob(rule, function(){
		var resultArray = [];
		mongo.connect(url, function(err,db) {
			assert.equal(null, err);
			var cursor = db.collection('user-data').find();
			cursor.forEach(function(err, doc) {
				//sendTextMessage(doc['id'], "Hello" ,token);
				console.log(doc+ "  Hello");
			}, function (){
				
			})
		})
	});
	// \\\\\\\\\\\\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\\\\\\\\\\\\ //
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
		var event = req.body.entry[0].messaging[i]
		var sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text.toUpperCase() === 'Menu'.toUpperCase() || (text.toUpperCase().indexOf('help'.toUpperCase()) !== -1)) {
				sendMenuMessage(sender, event, token)
				continue
			}
			else if (text.toUpperCase().indexOf('musi'.toUpperCase()) !== -1 ) {
				sendMusicMenu(sender, event, token);
				sendTextMessage(sender, "Pour plus d'infos, veuillez taper le nom du bot.", token)
				continue
			}
			else if (text.toUpperCase().indexOf('film'.toUpperCase()) !== -1  ||  text.toUpperCase().indexOf('serie'.toUpperCase()) !== -1 ) {
				sendMoviesMenu(sender, event, token);
				sendTextMessage(sender, "Pour plus d'infos, veuillez taper le nom du bot.", token)
				continue
			}
			else if (text.toUpperCase().indexOf('sortie'.toUpperCase()) !== -1) {
				sendSortiesMenu(sender, event, token);
				sendTextMessage(sender, "Pour plus d'infos, veuillez taper le nom du bot.", token)
				continue
			}
			else if (text.toUpperCase().indexOf('lifestyle'.toUpperCase()) !== -1) {
				sendLifestyleMenu(sender, event, token);
				sendTextMessage(sender, "Pour plus d'infos, veuillez taper le nom du bot.", token)
				continue
			}
			sendApiMessage(sender, event, token)
		}
		if (event.postback) {
			if (event.postback.payload === "Demarrer") {
				var x = "";
				graphapi.getUser(sender, function (result) {
					x = result;
					stockUser(sender);
					console.log(x);
					sendTextMessage(sender,"Salut "+ x +"! Je suis CybExbot, votre annuaire de BOTs sur messenger developpe par CybEx Solutions."+"\n"+"Pour continuer, veuillez taper le nom d'un domaine parmis les suivants:\n 🎶 Musique ️🎶 \n 🎡 lifestyle 🎡 \n 🎥 film/serie 🎥 \n ⛱ sortie ⛱", token);
				});
				continue
			}
			else {
			sendTextMessage(sender, event.postback.payload , token);
			}
		}
    }
	res.sendStatus(200)
}

var exports = module.exports = {
	sendTextMessage:sendTextMessage
};
exports.getSender = function () {
	return sender;
}

function stockUser(user) {
	request({
        url: 'https://graph.facebook.com/v2.6/'+user+'?access_token='+token,
        method: 'GET'
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
		var user = new User(body['id'], body['first_name'], body['last_name'], body['profile_pic'], body['locale'], body['timezone'], body['gender'])
		console.dir(body['id'])
		mongoJS.addUser(user);
    })
}

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
function sendApiMessage(sender,event) {
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

function sendMusicMenu(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Record Bird",
                    "image_url":"https://www.recordbird.com/img/ios-landingpage/mainpic.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Record Bird",
						"payload": "Record Bird: BOT qui te pushe des articles et les nouveaux sons de tes artistes préféres."
                    }],
                },{
                    "title": "Soulection",
                    "image_url":"https://botlist.co/system/BotList/Bot/logos/000/002/353/medium/soulection.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Soulection",
						"payload": "Soulection: BOT qui t'aide à trouver les meilleurs plans du label."
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

function sendMoviesMenu(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Movie Finder",
                    "image_url":"https://botlist.co/system/BotList/Bot/logos/000/002/620/medium/submission1325iKVhxx.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Movie Finder",
						"payload": "Movie Finder: BOT qui sélectionne les films que tu vas regarder ce soir en fonction de tes critères personnels et de tes préférences."
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

function sendLifestyleMenu(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Gidi",
                    "image_url":"https://botlist.co/system/BotList/Bot/logos/000/000/060/medium/14542471_938663562906261_5034685899454906169_o.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Gidi",
						"payload": "Gidi: BOT qui t'aide à trouver le meilleur cadeau pour ses proches en se basant sur :Occasion, Age, Budget, Passion, Intérêts etc."
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

function sendSortiesMenu(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "SURE",
                    "image_url":"https://botlist.co/system/BotList/Bot/logos/000/000/613/medium/Profile.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "SURE",
						"payload": "SURE: BOT qui classe les meilleurs plans restaurants en fonction du nombre de fois où le lieu a été publié sur Instagram."
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

module.exports = {
	discussionButtons:discussionButtons,
	facebookDemarre:facebookDemarre,
	facebookMenu:facebookMenu,
	VerificationToken:VerificationToken,
	postMessages:postMessages
}