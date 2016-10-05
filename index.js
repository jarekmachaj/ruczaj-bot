var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./logging.js');
var fbMsgBot = require('./msg-bot.js');

var app = express();
logger.settings.logging = true;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
var bot = new fbMsgBot(process.env.RUCZAJ_ACCESS_TOKEN, 278725065568764, 'ruczaj_verify_token');

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