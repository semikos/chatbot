function sendMenuMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "menu",
                "elements": [{
                    "title": "Adecco France",
                    "image_url":"https://images.search.yahoo.com/yhs/search;_ylt=AwrB8ptZNYNZ8wcAg7E2nIlQ;_ylu=X3oDMTBsZ29xY3ZzBHNlYwNzZWFyY2gEc2xrA2J1dHRvbg--;_ylc=X1MDMTM1MTE5NTcwMgRfcgMyBGFjdG4DY2xrBGJjawMyYnU0czM1Y2pzamhjJTI2YiUzRDMlMjZzJTNEMjIEY3NyY3B2aWQDMi5DeXVqWTVMakVsLkp3WldUNU9MQXFOTVRrMkxnQUFBQUJVMUZoRQRmcgN5aHMtTGtyeS1uZXd0YWIEZnIyA3NhLWdwBGdwcmlkA2F3M3hldFNPVEhXbnJkNHhrbmlOakEEbXRlc3RpZANudWxsBG5fc3VnZwMwBG9yaWdpbgNpbWFnZXMuc2VhcmNoLnlhaG9vLmNvbQRwb3MDMARwcXN0cgMEcHFzdHJsAwRxc3RybAMxNARxdWVyeQNhZGVjY28gZnJhbmNlIAR0X3N0bXADMTUwMTc3MTEwNQR2dGVzdGlkA251bGw-?gprid=aw3xetSOTHWnrd4xkniNjA&pvid=2.CyujY5LjEl.JwZWT5OLAqNMTk2LgAAAABU1FhE&p=adecco+france+&fr=yhs-Lkry-newtab&fr2=sb-top-images.search.yahoo.com&ei=UTF-8&n=60&x=wrt&type=YHS_SMW_100&hsimp=yhs-newtab&hspart=Lkry#id=1&iurl=http%3A%2F%2Frmsnews.com%2Fwp-content%2Fuploads%2F2011%2F11%2FAdecco-France-adeccofrance-sur-Twitter.png&action=click",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://m.me/adecco.france",
                        "title": "Accés"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "4 exemples de Chatbots",
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