// classe pour la creation des templates en json pour les envoyer à api.ai afin de recupérer cette resultat et afficher sur massenger
function isUrl(url) {
  const pattern = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,63}\b(\/[-a-zA-Z0-9@:%_\(\)\+.,~#?&//=]*)?$/gi;
  return pattern.test(url);
};
class FacebookTemplate {

  constructor() {
    this.template = {};
  }

addQuickReply(text, payload) {

     if (!this.template.quick_replies)
      this.template.quick_replies = [];

    if (this.template.quick_replies.length === 11)
      throw new Error('There can not be more than 11 quick replies');


    //  text = breakText(text, 20)[0];

    let quickReply = {
      content_type: 'text',
      title: text,
      payload: payload
    };


    this.template.quick_replies.push(quickReply);

    return this;
  }



  get() {
    return this.template;
  }



}

class Generic extends FacebookTemplate {
  constructor() {
    super();

    this.bubbles = [];

    this.template =
    {
  }

}
addBubble(title, subtitle) {
  if (this.bubbles.length === 10)
    throw new Error('10 bubbles are maximum for Generic template');

  if (!title)
    throw new Error('Bubble title cannot be empty');

  if (title.length > 80)
    throw new Error('Bubble title cannot be longer than 80 characters');

  if (subtitle && subtitle.length > 80)
    throw new Error('Bubble subtitle cannot be longer than 80 characters');

  let bubble = {
    title: title ,
    type : 1
  };

  if (subtitle)
    bubble['subtitle'] = subtitle;

  this.bubbles.push(bubble);

  return this;
}
getLastBubble() {
  if (!this.bubbles || !this.bubbles.length)
    throw new Error('Add at least one bubble first!');

  return this.bubbles[this.bubbles.length - 1];
}
addUrl(url) {
  if (!url)
    throw new Error('URL is required for addUrl method');

  this.getLastBubble()['item_url'] = url;

  return this;
}

addImage(url) {
  if (!url)
    throw new Error('Image URL is required for addImage method');


  this.getLastBubble()['imageUrl'] = url;

  return this;
}
addButton(title, value) {
  // Keeping this to prevent breaking change
  if (!title)
    throw new Error('Button title cannot be empty');

  if (!value)
    throw new Error('Button value is required');

  if (isUrl(value)) {
  return this.addButtonByType(title, value, 'web_url');
} else {
    return this.addButtonByType(title, value, 'postback');
  }
}
addButtonByType(title, value, type, options) {
  if (!title)
    throw new Error('Button title cannot be empty');

  const bubble = this.getLastBubble();

  bubble.buttons = bubble.buttons || [];

  if (bubble.buttons.length === 3)
    throw new Error('3 buttons are already added and that\'s the maximum');

  if (!title)
    throw new Error('Button title cannot be empty');

  const button = {
  text: title,
    postback: value
  };



  bubble.buttons.push(button);

  return this;
}

get() {
  if (!this.bubbles || !this.bubbles.length)
    throw new Error('Add at least one bubble first!');

  this.template = this.bubbles;

  return this.template;
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
class generic extends Generic {
  constructor() {
    super();
    console.log('Deprecation notice: please use .Generic instead of .generic method, lower case method names will be removed in next major version of Claudia bot builder');
  }
}



  module.exports =
  {   fbTemplate: FacebookTemplate,
    Text: Text ,
    text : text,
    Generic:Generic
  }
