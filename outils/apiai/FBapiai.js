'use strict'
//utilisation d'api.ai
//traitement des actions
//lire les message recus
//retourner les resultat des traitement selon le cas
// conversion du json du api.ai

const request = require('request');
const apiai = require('apiai');
const async = require('async');
const APIAI_TOKEN = process.env.CLIENT_ACCESS_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;
const apiaiApp = apiai(APIAI_TOKEN);
const Templates = require('../templates/template.js');
const presta = require ('../siteapi/searchapi.js');
const facebook = require ('../facebook/facebook.js');
const mallocbase = require('../data/mallocbase.js');
function apiaiMessages(event)
{
  let sender = event.sender.id;
  let text = event.message.text;
  let apiai = apiaiApp.textRequest(text,{sessionId:event.sender.id });
  apiai.on('response', (response) =>
  {
    let aiText = response.result.fulfillment.speech;
    let responseMessages = response.result.fulfillment.messages;
     if (aiText)
     {
    if (aiText=="recherche api")
     {
      // if (feed) {clearTimeout(feed);}
       responseMessages =presta.search(response.result.fulfillment.displayText ,response.result.parameters['number'],response.result.parameters['number1']) ;
       mallocbase.recherche_data(sender,response.result.fulfillment.displayText);
       json_apiai_convertion(sender, responseMessages);

         //var feed=setTimeout(function(){envoiMessGen(sender , Templates.feedback)},1000*60);
     }
      else envoiMessText(sender,aiText);

     }
     else if ( responseMessages)
     {
      json_apiai_convertion(sender, responseMessages);

     }
  });

  apiai.on('error', (error) =>
  {
    console.log(error);
  });

  apiai.end();
}

function envoiMessText (ID_recepteur, newMessage)
{
 request(
{
 url: 'https://graph.facebook.com/v2.6/me/messages',
 qs: {access_token: PAGE_ACCESS_TOKEN},
 method: 'POST',
 json:
 {
   recipient: { id: ID_recepteur },message: {
      text: newMessage
    }

 }
},function (error, response, body)
{
 if (!error && response.statusCode == 200)
     {
       var ID_recepteur = body.recipient_id;
       var messageId = body.message_id;
       console.log("envoi du message de id %s à %s",messageId, ID_recepteur);


     }

 else {
         console.error("impossible d'envoyer le message.");
         console.error(response);
         console.error(error);

        }
});

}

//les apiaiActions du api.ai

function apiaiActions(req, res)
 {
  console.log('*** Webhook for api.ai query ***');
  if (req.body.result.action === 'search')
   {
     let motcle = req.body.result.parameters['motcle'];

     console.log('*** rechercher ***' ,motcle);

     return res.json({

     messages:presta.search(motcle) ,
     displayText:motcle,
     source: 'search'});

     console.log(presta.search(motcle));
     }
     else   if (req.body.result.action === 'recherche')
        {
          let vet = req.body.result.parameters['vetement'];
          let color = req.body.result.parameters['color'];
          let critere= req.body.result.parameters['criteres'];

          let motcle ;
          if (vet)
           motcle= vet;
          if(critere)
          {if (motcle)
          motcle=motcle+' '+critere ;
          else motcle = critere;}

          if (color )
          {if (motcle)
            motcle=motcle+' '+color ;
            else
            motcle =color;
           }


              return res.json({
             speech: "recherche api",
            displayText:motcle,
            source: 'recherche'});


          }
   else
   {
     return res.status(400).json({
      status: {
      code: 400,
      errorType: 'jai pas compri.'}});
    }

}




//convertion la resultat json de l'api.ai en json pour facebook
function json_apiai_convertion(sender, messages)
{
  let facebookMessages = []; // array with result messages
  for (let messageIndex = 0; messageIndex < messages.length; messageIndex++)
  {
    let message = messages[messageIndex];
        switch (message.type)
        {
          //message.type 0 est un message text
          case 0:
          if (message.speech)
                    {


                       facebookMessages.push({text:message.speech });

                    }

          break;
          //message.type 1 means card message
          case 1: {
                    let carousel = [message];
                    for (messageIndex++; messageIndex < messages.length; messageIndex++)
                    {
                    if (messages[messageIndex].type == 1)
                    {
                      carousel.push(messages[messageIndex]);
                    }
                    else
                     {
                      messageIndex--;
                        break;
                    }
                   }

                  let facebookMessage = {};
                    carousel.forEach((c) =>
                    {
                        // buttons: [ {text: "hi", postback: "postback"} ], imageUrl: "", title: "", subtitle: ""
                    let card = {};
                    card.title = c.title;
                    card.image_url = c.imageUrl;
                    if ((c.subtitle))
                     {
                      card.subtitle = c.subtitle;
                     }
                     if((c.item_url))
                     {
                       card.item_url= c.item_url;
                     }
                      //If button is involved in.
                     if (c.buttons.length > 0)
                     {
                       let buttons = [];
                       for (let buttonIndex = 0; buttonIndex < c.buttons.length; buttonIndex++)
                           {
                              let button = c.buttons[buttonIndex];
                              if (button.text)
                              {
                                    let postback = button.postback;
                                    if (!postback) {postback = button.text;}
                                    let buttonDescription = {  title: button.text};
                                    if (postback.startsWith("http"))
                                     {
                                        buttonDescription.type = "web_url";
                                        buttonDescription.url = postback;
                                     }
                                     else
                                     {
                                        buttonDescription.type = "postback";
                                        buttonDescription.payload = postback;
                                     }

                                    buttons.push(buttonDescription);
                                }
                            }

                            if (buttons.length > 0) {
                                card.buttons = buttons;
                            }
                        }

                        if (!facebookMessage.attachment) {
                            facebookMessage.attachment = {type: "template"};
                        }

                        if (!facebookMessage.attachment.payload) {
                            facebookMessage.attachment.payload = {template_type: "generic", elements: []};
                        }

                        facebookMessage.attachment.payload.elements.push(card);
                    });

                    facebookMessages.push(facebookMessage);
                }

               break;
            //message.type 2 means quick replies message
         case 2: {
                    if (message.replies && message.replies.length > 0) {
                        let facebookMessage = {};
                        facebookMessage.text = message.title ? message.title : 'Choisir ;)';
                        facebookMessage.quick_replies = [];
                        message.replies.forEach((r) => {
                        facebookMessage.quick_replies.push({
                                content_type: "text",
                                title: r,
                                payload: r
                            });
                        });

                        facebookMessages.push(facebookMessage);
                    }
                }
           break;
                //message.type 3 means image message
                case 3:

                    if (message.imageUrl) {
                        let facebookMessage = {};

                        // "imageUrl": "http://example.com/image.jpg"
                        facebookMessage.attachment = {type: "image"};
                        facebookMessage.attachment.payload = {url: message.imageUrl};

                        facebookMessages.push(facebookMessage);
                    }

                    break;
                //message.type 4 means custom payload message
                case 4:
                    if (message.payload && message.payload.facebook) {
                        facebookMessages.push(message.payload.facebook);
                    }
                    break;

          default:
          break;
        }

}

 return new Promise((resolve, reject) =>
 {
       async.eachSeries(facebookMessages, (msg, callback) => {
       envoiAction(sender, "typing_on");
       envoiMessGen(sender, msg);
        callback(); },
        (err) => {if (err) { console.error(err);
                             reject(err);
                           }
                 else {
                        console.log('Messages sent');
                        resolve();
                      }
                  });
   });
}

// function envoiMessGen(sender, messageData)
//   {
//      return new Promise((resolve, reject) =>
//      {
//        request({
//                  url: 'https://graph.facebook.com/v2.6/me/messages',
//                  qs: {access_token: PAGE_ACCESS_TOKEN},
//                  method: 'POST',
//                  json: {
//                          recipient: {id: sender},
//                          message: messageData
//                       }
//              },
//              (error, response) => {
//                  if (error) {
//                      console.log('Error sending message: ', error);
//                      reject(error);
//                  } else if (response.body.error) {
//                      console.log('Error: ', response.body.error);
//                      reject(new Error(response.body.error));
//                  }
//
//                  resolve();
//              });
//          });
//      }

     function envoiMessGen (sender, newMessage)
         {
          request(
         {
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token: PAGE_ACCESS_TOKEN},
          method: 'POST',
          json:
          {
            recipient: { id: sender },
            message: newMessage
          }
         },function (error, response, body)
         {
          if (!error && response.statusCode == 200)
              {
                var ID_recepteur = body.recipient_id;
                var messageId = body.message_id;
                console.log("envoi du message de id %s à %s",messageId, ID_recepteur);
              }

          else {
                  console.error("impossible d'envoyer le message.");
                  console.error(response);
                 console.error(error);
                 }
         });
         }


function envoiAction(sender, action)
     {
       request({
                 url: 'https://graph.facebook.com/v2.6/me/messages',
                 qs: {access_token: PAGE_ACCESS_TOKEN},
                 method: 'POST',
                 json: {
                       recipient: {id: sender},
                       sender_action: action
                       }

              }, (error, response) =>
              {
                 if (error) {
                     console.error('Error sending action: ', error);

                 } else if (response.body.error) {
                     console.error('Error: ', response.body.error);

                 }
             }
           );
}




module.exports =
{
apiaiActions:apiaiActions,
apiaiMessages:apiaiMessages,
json_apiai_convertion:json_apiai_convertion
}
