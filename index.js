'use strict'

const token = process.env.FB_PAGE_TOKEN
const vtoken = process.env.FB_VERIFY_ACCESS_TOKEN
const Facebook = require('./outils/facebook/facebook.js');
const apiaiApp = require('apiai')(process.env.CLIENT_ACCESS_TOKEN)
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

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

Facebook.facebookDemarre();
Facebook.facebookMenu();

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
	  
      if (event.message && event.message.text) {
		  console.log('eventmessage')
        let text = event.message.text 
        if (text === 'Generic') {
            sendButtonMessage(sender,event,token)
			 console.log('message sent')
            continue
        }
		
		/*********************************************************************************************************************************/
		else if (text.toUpperCase() === 'Menu'.toUpperCase() || (text.toUpperCase().indexOf('nouveau'.toUpperCase()) !== -1)
			|| (text.toUpperCase().indexOf('neuf'.toUpperCase()) !== -1) || (text.toUpperCase().indexOf('bot'.toUpperCase()) !== -1)) {
            sendMenuMessage(sender, "!! " +event, token)
			 console.log('message sent')
            continue
        }
		/*********************************************************************************************************************************/
		
        console.log('message sent before sendApiMessage')
		sendApiMessage(event)
		console.log('message sent after sendApiMessage')
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })


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

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
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

/*******************************************************************************************************************************/
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
/*****************************************************************************************************************************/

//Send message using API.AI
function sendApiMessage(event) {
  
  console.log('inside method')
  let sender = event.sender.id;
  let text = event.message.text;

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
