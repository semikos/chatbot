'use strict'

let templates = {
	"welcome_message":
	{
		"recipient":{
		"id":""
		},
		"message":{
		"text":"Please share your location:",
		"quick_replies":[{
				"content_type":"text",
				"title":"Red",
				"payload":"You Selected Red",
				"image_url":"http://petersfantastichats.com/img/red.png"
			}]
		}
	}
}

 let defaulttemplates = {
	"Menu":{
		"setting_type" : "call_to_actions",
		"thread_state" : "existing_thread",
		"call_to_actions": 
			[{
				"type":"web_url",
				"title":"Voire Site Web.",
				"url":"https://www.facebook.com/cybexbot/"
			},{
				"type":"postback",
				"title":"Help",
				"payload":"Veuillez ecrire Menu ou Help pour plus d informations."
			}, {
				"type":"postback",
				"title": "Menu",
				"payload": "Veuillez taper le nom d'un domaine parmis les suivants:\n 📺 Media 📺 \n 📰 Serviciel 📰 \n ️🎭 Divertissement ️🎭 \n 🛍️ E-commerce 🛍️"
			}]
	},
	"Demarrer":{
	"setting_type":"call_to_actions",
	"thread_state":"new_thread",
	"call_to_actions":
	[
		{
			"payload":"Demarrer"
		}
	]
	}
}
	
module.exports =
{
	templates: templates ,
	defaulttemplates:defaulttemplates ,
};
