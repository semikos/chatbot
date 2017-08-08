// creation d'une panier

'use strict'

function isUrl(url) {
  const pattern = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,63}\b(\/[-a-zA-Z0-9@:%_\(\)\+.,~#?&//=]*)?$/gi;
  return pattern.test(url);
};

class FacebookTemplate
{
  constructor()
{
    this.template = {};
}

}

class paniermaker extends FacebookTemplate {
  constructor() {
    super();
  //  this.products = [];
    this.template = {

      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "list",
              "elements": [
                  {
                      "title": "Classic T-Shirt Collection",
                      "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
                      "subtitle": "See all our colors",
                      "default_action": {
                          "type": "web_url",
                         "url": "https://peterssendreceiveapp.ngrok.io/shop_collection",
                        //  "messenger_extensions": true,
                        //  "webview_height_ratio": "tall",
                        //  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                      },
                      "buttons": [
                          {
                              "title": "View",
                              "type": "web_url",
                              "url": "https://peterssendreceiveapp.ngrok.io/collection",
                            //  "messenger_extensions": true,
                            //  "webview_height_ratio": "tall",
                            //  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
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

}}
addproduct(title, subtitle ,quantity,price,currency,imgurl) {

  if (!title)
    throw new Error('Bubble title cannot be empty');

  if (title.length > 80)
    throw new Error('Bubble title cannot be longer than 80 characters');

  if (subtitle && subtitle.length > 80)
    throw new Error('Bubble subtitle cannot be longer than 80 characters');

  let product = {
    title: title ,
    quantity:quantity,
    price:price ,
    currency:currency,
    image_url:imgurl,
    buttons:[]
  };

  if (subtitle)
    product['subtitle'] = subtitle;

  this.products.push(product);

  return this;
}
getLastproduct() {
  if (!this.products || !this.products.length)
    throw new Error('Add at least one product first!');

  return this.products[this.products.length - 1];
}

addButton(title, value) {
  // Keeping this to prevent breaking change
  if (!title)
    throw new Error('Button title cannot be empty');

  if (!value)
    throw new Error('Button value is required');



  //  return this.products.buttons.addButtonByType(title, value, 'postback');

  const product = this.getLastproduct();

  product.buttons = product.buttons || [];



  if (!title)
    throw new Error('Button title cannot be empty');

  const button = {
  text: title,
    postback: value
  };



   product.buttons.push(button);

 return this;
}

get() {
  if (!this.products || !this.products.length)
    throw new Error('Add at least one bubble first!');

    this.template.attachment.payload.elements = this.products;

  return this.template.attachment;
}
}






class Text extends FacebookTemplate {
  constructor(text) {
    super();

    if (!text)
      throw new Error('Text is required for text template');

    this.template = {
      text: text
    };
  }
}
class text extends Text {
  constructor(text) {
    super(text);
    console.log('Deprecation notice: please use .Text instead of .text method, lower case method names will be removed in next major version of Claudia bot builder');
  }
}
class generic extends paniermaker {
  constructor() {
    super();
    console.log('Deprecation notice: please use .Generic instead of .generic method, lower case method names will be removed in next major version of Claudia bot builder');
  }
}



  module.exports =
  {   fbTemplate: FacebookTemplate,
    paniermaker,paniermaker
  }
