// var redis = require('redis');
// var statics = require('../statics');
// var utils = require('../utils/sockets_utils');
// var redisSubscriber = redis.createClient(); // subscribe and listen to the channel for new messages
//
// module.exports.init = function(){
//   redisSubscriber.on('ready', function(){
//     redisSubscriber.subscribe('webapp:notifier');
//   });
//   redisSubscriber.on("message", function(channel, message){
//     try{
//       var messageHash = JSON.parse(message); // TODO - catch parse error
//     }catch(e){
//       console.log(e);
//       return false;
//     }
//     var forUserID = messageHash['user_id']  // message needs to arrive in this way = {user_id:ID,message:message}
//     var msg = messageHash['message'];
//     var listOfSockets = utils.sendMessageToClientSockets(forUserID, msg);
//   });
// }
