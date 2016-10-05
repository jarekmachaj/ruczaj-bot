var http = require('http');
var url = require('url');
var os = require("os");
var logger = require('./logging.js');
var fbMsgBot = require('./msg-bot.js');

logger.settings.logging = true;
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

var bot = new fbMsgBot(process.env.RUCZAJ_ACCESS_TOKEN, process.env.RUCZAJ_PROFILE_ID, process.env.TOKEN_VERIFICATION_NAME);
bot.setWelcomeAction(function(params){
    var senderid = params.sender;
    var userDetails = bot.getUserDetails(params.sender);    
    bot.sendTextMessage('Cześć ' + userDetails.first_name + os.EOL + 'Gdy tylko odbierzemy wiadomość na pewno do Ciebie odpiszemy.' + os.EOL + 'Jeśli to coś pilnego, proszę wyślij nam e-mail na adres: ruczajkrk@gmail.com', params);
}, 2);

http.createServer(function (request, response) {
    var pathName = url.parse(request.url).pathname;
    switch (pathName){
        case '/' :
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('This is Ruczaj-bot Server - beta');
            response.end();
            break;
        case '/webhook' :
            bot.fbWebhook(request, response);
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('This is Ruczaj-bot Server - beta');
            response.end();
    }
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');