var synRequest = require('sync-request');

var senderid = 278725065568764;
var token = '';
var res = synRequest('GET', 'https://graph.facebook.com/v2.6/' + senderid + '?fields=first_name&access_token=' + token);
var user = JSON.parse(res.getBody('utf8'));
console.log(user.first_name);