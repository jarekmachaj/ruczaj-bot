var express = require('express');
var bodyParser = require('body-parser');
var os = require("os");
var logger = require('./logging.js');
var fbMsgBot = require('./msg-bot.js');


var app = express();
logger.settings.logging = true;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var bot = new fbMsgBot(process.env.RUCZAJ_ACCESS_TOKEN, process.env.RUCZAJ_PROFILE_ID, process.env.TOKEN_VERIFICATION_NAME);
bot.setWelcomeAction(function(params){
    var senderid = params.sender;
    var userDetails = bot.getUserDetails(params.sender);    
    bot.sendTextMessage('Cześć ' + userDetails.first_name + os.EOL + 'Gdy tylko odbierzemy wiadomość na pewno do Ciebie odpiszemy.' + os.EOL + 'Jeśli to coś pilnego, proszę wyślij nam e-mail na adres: ruczajkrk@gmail.com', params);
}, 2);


app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is Ruczaj-bot Server - beta');
});

// Facebook Webhook
app.all('/webhook', function (req, res) {
    bot.fbWebhook(req, res);    
});