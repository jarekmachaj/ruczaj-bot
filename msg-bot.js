var synRequest = require('sync-request'); //from npm
var request = require('request'); //from npm
var querystring = require('querystring'); //from npm
var logger = require('./logging.js');

logger.settings.logging = true;

var msgBot = function(appAccessToken, pageProfileId, verifyTokenName){
    
    logger.log('msgBot contructor');
    //if (appAccessToken == undefined || appAccessToken == null) throw 'Access token is missing';

    this._pageProfileId = pageProfileId; //so it won't send messanges to itself
    this._verifyTokenName = verifyTokenName;  
    this._appAccessToken = appAccessToken;  
    this._fbProtocol = 'https://'
    this._fbHost = "graph.facebook.com";
    this._fbApiVersion = "v2.6";
    this._actions = [];
    this._defaultAction = function() { console.log('Set the default action...'); };
    this._welcomeAction = undefined;
    this._reservedActionNames = ['default', 'error'];
}


//ie: buildGraphUrl([12435436] - array, {fields : 'first_name,secondName''})
//https://graph.facebook.com/v2.6/me/messages?access_token=PAGE_ACCESS_TOKEN
//https://graph.facebook.com/v2.6/[senderid]/?fields=first_name&access_token=[token]'
msgBot.prototype.buildGraphUrl = function(params, queryParams){
    var query = this._fbProtocol + '/' + this._fbHost + '/' + this._fbApiVersion;
    if (params != null && params != undefined && params.length > 0) query = query + '/' + params.join('/');
    if (queryParams != null && queryParams != undefined) query = query + '?' + querystring.strigify(queryParams);  
    return query;  
}

//attach and run from HTTP GET||POST /webhook
msgBot.prototype.fbWebhook = function(req, res) {
    if (req.method == "GET"){
        if (req.query['hub.verify_token'] === this._verifyTokenName) {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token');
        }        
        return;
    } else {
        var messaging_events = req.body.entry[0].messaging;
        for (var i = 0; i < messaging_events.length; i++) {
            var event = req.body.entry[0].messaging[i];
            
            if (this._pageProfileId != undefined && event.sender.id == this._pageProfileId) continue;            
            
            var sender = event.sender.id;        
            if (event.message && event.message.text) {
                var text = event.message.text
                this.takeAction(text, {sender: sender});
            }
        }
        res.sendStatus(200);
    }
}

//ie addaction('sendMsg', function(){console.log('message sent');})
msgBot.prototype.setAction = function (name, action) {
    if (this._reservedActionNames.indexOf(name) < 0) throw 'Action name ' + name, ' is forbidden';
    this._actions[name] = action;
}

//ie setDefaultAction(function(){console.log('message sent');})
msgBot.prototype.setDefaultAction = function (action) {
    this._defaultAction = action;
}

msgBot.takeWelcomeAction = function(){

} 

//action here is a text message from user - determining next steps
msgBot.prototype.takeAction = function(action, params){
    if (this._welcomeAction != undefined) this._welcomeAction(params);
    var selectedAction = this._defaultAction;    
    for (var i = 0; i < this._actions.length; i++){
        if (action.indexOf(this._actions[i]) >= 0) {
            selectedAction = this._actions[i];
            break;
        }
    }    
    if (selectedAction != undefined && selectedAction != null) selectedAction();            
}

msgBot.prototype.sendTextMessage = function(msg, recipientid){
    var messageData = { text:msg }

    request({
        url: this.buildGraphUrl(['me', 'messages'], {'access_token' : this._appAccessToken}),
        method: 'POST',
        json: {
            recipient: {id: recipientid},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            logger.log('Error sending messages: ', error)
        } else if (response.body.error) {
            logger.log('Error: ', response.body.error)
        }
    })
}

msgBot.prototype.getUserDetails = function(senderid) {
    var res = synRequest('GET', this.buildGraphUrl(senderid, {fields : 'first_name', access_token : this.appAccessToken}));
    var user = JSON.parse(res.getBody('utf8'));
    return user;
}


module.exports = msgBot;
