var os = require("os");
var logger = require('fast-logger');
var bot = require('fbot');

logger.settings.logging = true;

bot.initialize(process.env.RUCZAJ_ACCESS_TOKEN, process.env.RUCZAJ_PROFILE_ID, process.env.TOKEN_VERIFICATION_NAME)
bot.runServer('0.0.0.0', process.env.PORT);

bot.setWelcomeAction(function(params){
    var senderid = params.sender;
    var userDetails = bot.getUserDetails(params.sender);    
    bot.sendTextMessage('Cześć ' + userDetails.first_name + os.EOL + 'Gdy tylko odbierzemy wiadomość na pewno do Ciebie odpiszemy.' + os.EOL + 'Jeśli to coś pilnego, proszę wyślij nam e-mail na adres: ruczajkrk@gmail.com', params);
}, 2);


