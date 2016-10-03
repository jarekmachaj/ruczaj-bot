var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var synRequest = require('sync-request');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});


// Server frontpage
app.get('/', function (req, res) {
    res.send('This is Ruczaj-bot Server - beta');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'ruczaj_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

var tempMessage = "Cześć, gdy tylko odbierzemy wiadomość na pewno do Ciebie odpiszemy. Jeśli to coś pilnego, proszę wyślij nam e-mail na adres: ruczajkrk@gmail.com";


app.post('/webhook', function (req, res) {
    var messaging_events = req.body.entry[0].messaging
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i]
        var sender = event.sender.id
        if (event.message && event.message.text) {
            var text = event.message.text
            sendTextMessage(sender, tempMessage /*"Text received, echo: " + text.substring(0, 200)*/)
        }
    }
    res.sendStatus(200)
})

var token =  process.env.RUCZAJ_ACCESS_TOKEN;

function getUserDetails(senderid) {
    var res = synRequest('GET', 'https://graph.facebook.com/v2.6/' + senderid + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + token);
    var user = JSON.parse(res.getBody('utf8'));
    return user;
}

function sendTextMessage(sender, text) {
    var user = getUserDetails(sender);
    var msg = 'Cześć ' + user.first_name + '/n' + text; 
    var messageData = { text:msg }
    
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
};
