//traitement des evenements des boutons du facebook envoyé
//rnevoyer les resultat aux utilisateur selon le cas.
'use strict';
// imports

const ApiAi = require('../apiai/FBapiai.js');;
const request = require('request');
const Facebook = require ('./facebook.js');
const async = require('async');
const Templates = require('../templates/template.js');
const presta = require ('../siteapi/searchapi.js');
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;
const fs = require ('fs');
const mallocdata = require('../data/mallocbase.js');
// postback event
function postbackRecu (event)
{
  var ID_Envoyeur = event.sender.id;
  var ID_recepteur = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var text = JSON.stringify(event.postback.payload);
  const cata= " Voici notre menu de catégories 👗👖👕👟👠" ;
  const prod="Voici notre selection des produits 👗👖👕👟👠"
  const soucat = "Quelle catégorie cherchez-vous?"
   var numberPattern = /\d+/g;
  if (text.indexOf('Souscat') !== -1)
  {

    var id =text.match( numberPattern )[0]
    var cat=presta.categories (id);
   envoiMessText(ID_Envoyeur,soucat);
   ApiAi.json_apiai_convertion(ID_Envoyeur,cat)

  }
  else if (text.indexOf('Produit')!== -1)
 {
   var id =text.match( numberPattern )
   if (id)
   {var cat=presta.products(id[0]);
  envoiMessText(ID_Envoyeur,prod);
  ApiAi.json_apiai_convertion(ID_Envoyeur,cat)}

}
else if (text.indexOf('simi')!== -1)
{
 var id =text.match( numberPattern )
 if (id)
 {var cat=presta.products(id[0]);
envoiMessText(ID_Envoyeur,prod);
ApiAi.json_apiai_convertion(ID_Envoyeur,cat)}

}
else if (text.indexOf('association')!== -1)
{
 var id =text.match( numberPattern )
 if (id)
 {
var asso=presta.association(id[0]);
envoiMessText(ID_Envoyeur,prod);
ApiAi.json_apiai_convertion(ID_Envoyeur,asso)}

}
else if (text.indexOf('acheter')!== -1)
{
 var id =text.match( numberPattern )
 if (id)
 {
}

}


else
  switch (text) {

 //affichage des catégories

  case '\"Categorie\"':
  var cat=presta.categories(2);
  console.log(cat);
 envoiMessText(ID_Envoyeur,cata);

 ApiAi.json_apiai_convertion(ID_Envoyeur,cat)
  break;
  // 1ere Salutation en bouton demarrer

  case '\"FACEBOOK_WELCOME\"':
   envoiMessText(ID_Envoyeur, " 🎉 Salut ✋✋✋ !!! 🎉 je suis 👼🏻 Ange 👼🏻 Votre assistante artificiel du marque 🔖 Malloc 🔖 ;)");

   setTimeout(function() {envoiMessGen(ID_Envoyeur, Templates.templates["welcome_message"])}, 2000);

   userinfo(ID_Envoyeur, (userinfos)=>{mallocdata.ajout(ID_Envoyeur,userinfos);});

  break;
// aide
 case '\"HELP\"':
 setTimeout(function() {
    envoiAction(ID_Envoyeur, "typing_on")},1000);
    setTimeout(function() {
        envoiMessText(ID_Envoyeur, " Salut !Je suis Ange 👼   ");},3000);

  setTimeout(function() {
     envoiAction(ID_Envoyeur, "typing_on")},4000);
     setTimeout(function() {
       envoiMessText(ID_Envoyeur, " Votre assistante artificiel du marque 🔖 Malloc 🔖 \n Et je vais vous aider à trouver vos besoin ;)");},6000);
setTimeout(function() {
   envoiAction(ID_Envoyeur, "typing_on")},6000);
 setTimeout(function() {
     envoiMessText(ID_Envoyeur, " Parlez avec moi , essayez d'entrer des mots clés !ou bien utiliser notre menu ");},8000);

  setTimeout(function() {
     envoiAction(ID_Envoyeur, "typing_on")},8000);

setTimeout(function() {
   envoiMessText(ID_Envoyeur, " j'espère que vous aide :D :D ! ");},9000);
 // setTimeout(function() {
 // envoiMessGen(ID_Envoyeur, Templates.helpvideo); }, 3000)

break;
  // fonction recherche
  case '\"Recheche\"' :
  envoiMessText(ID_Envoyeur,"Quels sont les mots clés 🔑 coresspondants aux produits recherchés 🔍 ?  par exemple: pantalon homme 👖, robe femme 👗...\n");
  break;
  //par defaut

  default:
   envoiMessText(ID_Envoyeur,text);
}
}


function envoiMessText (ID_recepteur, newMessage)
{

 request(
{
 url: ' https://graph.facebook.com/v2.6/me/messages',
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
function envoiMessGen (sender, newMessage)
    {
     request(
    {
     url: ' https://graph.facebook.com/v2.6/me/messages',
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
    function userinfo(id ,callback){
      request(
                    {
                     url: 'https://graph.facebook.com/v2.6/'+id+'?fields=first_name,last_name,profile_pic,locale,timezone,gender',
                     qs: {access_token: "EAACa3wkLpJIBAFNHFZB8I6vXgMGaqyRoyy75nSgIkQoqYeyNqJpJNFsyVukGdKm2J8v9LEbZBScc00NT7iNVskvOGERSKb5d8UXi5cZCInEBDh2wlhhZB9CiBbyKl6SWWTEKbaZAMeml7cBZAFWtqWEHiprcOdm88xJdOnvXzVDgZDZD"},
                     method: 'GET',
                     json:{}
                   },function (error, res,req)
                    {

                     if (!error && res.statusCode == 200)
                         {
                           var   name = req.first_name;
                            console.log("le nom est "+name);
                            // return name;
                            callback(req);

                         }

                     else {

                          //   console.error(response);
                            console.error(error);
                            //callback ('erreur' );
                            }

    })

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
                 }, (error, response) => {
                     if (error) {
                         console.error('Error sending action: ', error);

                     } else if (response.body.error) {
                         console.error('Error: ', response.body.error);

                     }


                 });
             }

module.exports =
{
postbackRecu:postbackRecu

}
