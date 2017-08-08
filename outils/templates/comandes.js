// creation d'une commande

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

class comandemaker extends FacebookTemplate {
  constructor() {
    super();
    this.products = [];
    this.template = {"attachment":{
     "type":"template",
     "payload":{
       "template_type":"receipt",
       "recipient_name":"malek tanabene",
       "order_number":"12345678902",
       "currency":"EUR",
       "payment_method":"Visa 2345",
       "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
       "timestamp":"1428444852",
        "elements": [],
 			 "address":{
 				 "street_1":"1 Hacker Way",
 				 "street_2":"",
 				 "city":"kelibia",
 				 "postal_code":"8090",
 				 "state":"CA",
 				 "country":"TN"
 			 },
 			 "summary":{
 				 "subtotal":75.00,
 				 "shipping_cost":4.95,
 				 "total_tax":6.19,
 				 "total_cost":56.14
 			 },
 			 "adjustments":[
 				 {
 					 "name":"New Customer Discount",
 					 "amount":20
 				 },
 				 {
 					 "name":"$10 Off Coupon",
 					 "amount":10
 				 }
 			 ]

  }}};

}
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
    currency:'EUR',
    image_url:imgurl,
  //  buttons:[]
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
class generic extends comandemaker {
  constructor() {
    super();
    console.log('Deprecation notice: please use .Generic instead of .generic method, lower case method names will be removed in next major version of Claudia bot builder');
  }
}



  module.exports =
  {   fbTemplate: FacebookTemplate,
    Text: Text ,
    text : text,
    comandemaker,comandemaker
  }
