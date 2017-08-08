'use strict'
//lecture des message envoyés par l'utilisateur
// les information de l'utlilisateur
// traitement des message text
//l'appele du api.ai
//evoi des message texts et les templates (list/geniric...)
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_ACCESS_TOKEN;
const request = require('request');
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;
const Templates = require('../templates/template.js');
const ApiAi = require('../apiai/FBapiai.js');
const PostBack = require('./FbPostback.js');
const presta = require ('../siteapi/searchapi.js')

// verification du token facebook
 function verification(req, res)  {
   if (req.query['hub.mode'] && req.query['hub.verify_token'] === FB_VERIFY_TOKEN)
    {
     res.status(200).send(req.query['hub.challenge']);
   } else {
     res.status(403).end();
   }
 };





// get started button
 function facebookDemarre(){
 // Start the request
 request({
     url: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token='+PAGE_ACCESS_TOKEN,
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     form:Templates.defaulttemplates["Demarre"]

 },
 function (error, response, body) {
     if (!error && response.statusCode == 200) {
         // Print out the response body
         console.log(": Updated.");
         console.log(body);
     } else {
         console.log(": Failed. Need to handle errors.");
         console.log(body);
     }
 });}

 function facebookMenu(){
  // Start the request
  request(
    {
      url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN,
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
  });}



// tous les messages recus


function Messagesrecu(req, res)
{
  var data = req.body;
  if (data.object === 'page') {
      data.entry.forEach(function(entry) {
       var pageID = entry.id;

      // itération de chaque message
      entry.messaging.forEach(function(event)
       {

        if (event.sender.id === pageID)
        { console.log ('je suis Ange et j ai dit', event.message.text);}
        else
          {if (event.message) { if (event.message.text) {messageTextRecu(event);}}
            else if (event.postback&& event.postback.payload){ PostBack.postbackRecu(event);
            }
           else { console.log("Webhook reçoi un evenement inconnue : ", event);}
         }


     });
      });

       res.sendStatus(200);
}
};


// les message text

function messageTextRecu (event)
{

var ID_Envoyeur = event.sender.id;
var ID_recepteur = event.recipient.id;
var timeOfMessage = event.timestamp;
var message = event.message;
var messageText = message.text;


console.log(" message reçu pour l'utilisateur %d et page %d en %d avec message:",ID_Envoyeur, ID_recepteur, timeOfMessage);
console.log(JSON.stringify(message));
const cata= " Voici notre menu de catégories 👗👖👕👟👠" ;

switch (messageText)
        {

        // salutation api.ai

         case '🎀 Catégories':
          var cat=presta.categories (2);
          console.log(cat);
         envoiMessText(ID_Envoyeur,cata);

         ApiAi.json_apiai_convertion(ID_Envoyeur,cat)
        // envoiMessGen(ID_Envoyeur, Templates.templates["options_message"]);
         break;
         // fonction recherche

        case '🔍 Recherche':
        //envoiMessText(ID_Envoyeur,"je suis vraiment désolée :( ! peux pas pour le moument . Malek n'as pas terminer cette fonction :'(  ");
        envoiMessGen(ID_Envoyeur, Templates.templates["MenuAcceuil"]);
        break;
        case '🔍 Trouver un produit':
        envoiMessText("Quels sont les mots clés coresspondants aux produits recherchés ? par exemple: chaussures homme , talon ...");

        // menu femme
        case 'Femme':
        envoiMessGen(ID_Envoyeur, Templates.templates["Menufemme"]);
        break;

       case 'page':
       pages(ID_Envoyeur);
       break;
       // la reponse par defaut
    //    case 'lets try':
    //    var newcomandes =new comandes.comandemaker ;
    //    newcomandes
    //    .addproduct('prod1','pksdf','3','30','DT','http://www.malloc.rocks/shop/34-large_default/robe-noire-et-blanc.jpg')
    //    //.addButton('suprimer','supprimer1')
    //    .get()
    //    console.log(newcomandes);
    //    envoiMessGen(ID_Envoyeur,newcomandes.template);
     //
     //
     //
    //  break;
    //  case 'panier' :
    //  var npanier = new panier.paniermaker;
    //  console.log('panierrr *****');
    //  envoiMessGen2(ID_Envoyeur,Templates.payement["hi"]);
    //  break;
     case 'mon nom' :
       //envoiMessText(ID_Envoyeur,info.first_name);
       console.log(presta.search('robe'));
       break;
       case 'info':
        break;
     default:
       ApiAi.apiaiMessages(event);
      // envoiMessText(ID_Envoyeur,"désolé je te comprend pas :( :'( Essayez des termes plus généraux ou vérifiez l'orthographe 😒😒😒.Vous pouvez également effectuer une nouvelle recherche ;) ");
      // setTimeout(function() {
      // envoiMessGen(ID_Envoyeur, Templates.templates["Menurech"]); }, 2000);
     break;
    }

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
       return 'true' ;

     }

 else {
         console.error("impossible d'envoyer le message.");
         console.error(response);
         console.error(error);
          return 'false' ;
        }
});

}


// envois un message facebook

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

    function envoiMessGen2 (sender, newMessage)
        {
         request(
        {
         url: 'https://graph.facebook.com/me/messages',
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



 function pages(id)
 {
   request(
              {

               url: 'HTTP://graph.facebook.com/v2.8/'+id+'/user_likes',
               qs: {access_token: "EAACa3wkLpJIBAFNHFZB8I6vXgMGaqyRoyy75nSgIkQoqYeyNqJpJNFsyVukGdKm2J8v9LEbZBScc00NT7iNVskvOGERSKb5d8UXi5cZCInEBDh2wlhhZB9CiBbyKl6SWWTEKbaZAMeml7cBZAFWtqWEHiprcOdm88xJdOnvXzVDgZDZD"},
               method: 'GET',
               json:{}
             },function (error, res,req)
              {

               if (!error && res.statusCode == 200)
                   {
                   //  var   name = req.first_name;
                      console.log(req);
                      // return name;
                   //   callback(req);

                   }

               else {

                    //   console.error(response);
                      console.error(error);
                      //callback ('erreur' );
                      }

})
 }








module.exports =
{
envoiMessGen:envoiMessGen,
envoiMessText:envoiMessText,
Messagesrecu:Messagesrecu,
facebookDemarre:facebookDemarre,
facebookMenu:facebookMenu,
verification:verification
}
