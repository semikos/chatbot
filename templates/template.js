// les templates par defaut en json

let templates = {
	// Salutation

	"welcome_message":
	{
   "text": " Je suis là pour vous aider à trouver les bons produits 👗👖👕👟👠",
    "quick_replies":
		[
      {
        "content_type":"text",
        "title": "🎀 Catégories",
        "payload": "Categories"
      },
      {
        "content_type":"text",
        "title": " 🔍 Recherche",
        "payload": "Recherche"
      }
		]
	},
// catalogue

	"options_message":
	{
      attachment:
			{
      type: "template",
      payload:
			 {
         template_type: "generic",
         elements:
			 [{
          title: "Femmme",
          subtitle: "Mode pour Femmes",
          item_url: "http://www.malloc.rocks/shop/fr/3-femmes",
          image_url: "http://www.malloc.rocks/shop/c/3-category_default/femmes.jpg",
          buttons: [{
            type: "web_url",
            url: "http://www.malloc.rocks/shop/fr/3-femmes",
            title: "ouvrir le web URL"
          }, {
            type: "postback",
            title: "Sous Catégorie",
            payload: "femme",
          }],
        }, {
          title: "Homme",
          subtitle: "Mode pour Homme",
          item_url: "http://www.malloc.rocks/shop/fr/12-homme",
          image_url: "https://s-media-cache-ak0.pinimg.com/736x/77/3c/08/773c0829671a5dda8239d64d2abb6152.jpg",
          buttons: [{
            type: "web_url",
            url: "http://www.malloc.rocks/shop/fr/12-homme",
            title: "ouvrir le web URL"
          }, {
            type: "postback",
            title: "Sous Catégorie",
            payload: "homme",
          }]
        }]
      }
    }
  },
  "MenuAcceuil": {
    "text":"Choisi votre critère ou taper un autre:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Femme",
        "payload":"femme"
      },
      {
        "content_type":"text",
        "title":"Homme",
        "payload":"homme"
      }
    ]
  },
	"Menufemme": {
    "text":"Choisi votre critère ou taper un autre:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Robe",
        "payload":"robe"
      },
      {
        "content_type":"text",
        "title":"Chemise",
        "payload":"chemise"
      },
			{
        "content_type":"text",
        "title":"Jupe",
        "payload":"jupe"
      }
    ]
  },
  "Menurech": {
 	"text":"Choisi votre critère ou taper un autre:",
 	 "quick_replies":[
 		 {
 			 "content_type":"text",
 			 "title":"Nouvelle recherche",
 			 "payload":"Nouvelle recherche"
 		 },
 		 {
 			 "content_type":"text",
 			 "title":"Continuer la recherche",
 			 "payload":"Continuer la recherche"
 		 }

 	 ]
  }

};

 let defaulttemplates = {
	"Menu":{
		"locale":"default",
		"composer_input_disabled":true,
		"call_to_actions": 
			[{	"title":" ❔ Aide",
				"type":"nested",
				"call_to_actions":
			   	[
					{
						"type":"web_url",
						"title":" 🌐 voir website",
						"url":"http://www.malloc.rocks/shop/fr/"
					},
					{
						"type":"postback",
						"title": " ❔ Aide",
						"payload":"HELP"
					}
				]
			},
			{	"title":"Nos offres",
				"type":"nested",
			    "call_to_actions": 
				[
					{
						"type":"postback",
						"title":" 🎀 Nos Catégorie",
						"payload":"Categorie"
					},
					{
						"type":"postback",
						"title":" 🔍 Recherche",
						"payload":"Recheche"
					}
                ]
			}]
	},
	"Demarre":{
	"setting_type":"call_to_actions",
	"thread_state":"new_thread",
	"call_to_actions":
	[
		{
			"payload":"Demarre"
		}
	]
	}
};

let payement =
{
	"hi":
	{
		"attachment": {
		        "type": "template",
		        "payload": {
		            "template_type": "list",
		           //"top_element_style": "large",
		            "elements": [


												 {
		 		                    "title": "Votre panier",
		 		                    "image_url": "https://pbs.twimg.com/media/CO2l-3oUYAAMV5S.jpg",
		 		                    "subtitle": "Bienvenu dans Malloc Boutiques",
														"default_action": {
	                        "type": "web_url",
	                        "url": "http://www.malloc.rocks/shop/fr/",
                          "webview_height_ratio": "tall",
	                        //"fallback_url": "http://www.malloc.rocks/shop/fr/"
	                    }
										},


		                {
		                    "title": "Classic White T-Shirt",
		                    "image_url": "http://www.malloc.rocks/shop/modules/ps_imageslider/images/sample-1.jpg",
		                    "subtitle": "100% Cotton, 200% Comfortable",
		                     "default_action": {
		                       "type": "web_url",
		                       "url": "https://malloc.rocks/shop",

		                         "webview_height_ratio": "tall",
		                    },
		                    "buttons": [
		                        {
		                            "title": "Buys",
		                            "type": "web_url",
		                            "url":"http://www.malloc.rocks/shop/fr/",
		                            // "messenger_extensions": true,
		                            // "webview_height_ratio": "tall",
		                            // "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
		                        }
		                    ]
		                },

										{
		                    "title": "Classic Blue T-Shirt",
		                    "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
		                    "subtitle": "100% Cotton, 200% Comfortable",
		                    // "default_action": {
		                    //     "type": "web_url",
		                    //     "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
		                    //     "messenger_extensions": true,
		                    //     "webview_height_ratio": "tall",
		                    //     "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
		                    // },
		                    "buttons": [
		                        {
		                            "title": "Buf",
		                            "type": "web_url",
		                            "url":"http://www.malloc.rocks/shop/fr/",
		                            // "messenger_extensions": true,
		                            // "webview_height_ratio": "tall",
		                            // "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
		                        }
		                    ]
		                },
										{
												"title": "Classic Blue T-Shirt",
												"image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
												"subtitle": "100% Cotton, 200% Comfortable",
												// "default_action": {
												//     "type": "web_url",
												//     "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
												//     "messenger_extensions": true,
												//     "webview_height_ratio": "tall",
												//     "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
												// },
												"buttons": [
														{
																"title": "Buf",
																"type": "web_url",
																"url":"http://www.malloc.rocks/shop/fr/",
																// "messenger_extensions": true,
																// "webview_height_ratio": "tall",
																// "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
														}
												]
										},


		            ],
		             "buttons": [
		                {
		                    "title": "View More",
		                    "type": "postback",
		                    "payload": "payload"
		                }
		            ]
		        }
		    }
		}
}
		let feedback = {
			"text": " Vous avez trouvé que vous chercher? ",
	     "quick_replies":
	 		[
	       {
	         "content_type":"text",
	         "title": "👍 Oui!",
	         "payload": "oui"
	       },
	       {
	         "content_type":"text",
	         "title": "👎 Non !",
	         "payload": "non"
	       }
	 		]
		}
		let helpvideo ={
    "attachment":{
      "type":"video",
      "payload":{
        "url":"https://www.facebook.com/1261828777234244/videos/1323442611072860/"
      }
    }}
module.exports =
{
helpvideo:helpvideo,
	templates: templates ,
	defaulttemplates:defaulttemplates ,
	payement:payement,
	feedback:feedback

};
