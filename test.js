var synRequest = require('sync-request');

var senderid = 100000280790482;
var token = 'EAAItVgJ8SpABACg2ZANkfX3xvMS6mY3ZBxvfyfGOHrZBdxSAsRVC44Wy0RdXB1SvRPxEvfMYZBXz4RuB9iuMnIpyg1xmm4EiVK5bouGTVoZAyIMToZCrVB1gyJ2ujQxg1QsZBPhsjAVs3KXBPjOXCVX99ZAIOYAnS8qdfumglynoEgZDZD';
var res = synRequest('GET', 'https://graph.facebook.com/v2.6/' + senderid + '?fields=first_name&access_token=' + token);
var user = JSON.parse(res.getBody('utf8'));
console.log(user.first_name);