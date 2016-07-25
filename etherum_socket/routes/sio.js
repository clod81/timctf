var socketioJwt = require('socketio-jwt');
var statics = require('../statics');
var jwtSecret = statics.list.jwtSecret;
var redisClient = statics.list.redisClient;
var io = statics.list.io;
var listSocketsNamespace = "user:sockets:"

function deliverToClientSockets(socketsList, msg){
  socketsList.forEach(function(socket_id){
    if(io.sockets.connected[socket_id]){
      io.sockets.connected[socket_id].emit("notification",
        {
          msg: msg
        }
      );
    }
  });
}

var sendMessageToClientSockets = function(userId, msg){
  redisClient.get(listSocketsNamespace + userId, function(err, list_from_redis){
    if(list_from_redis != null){
      try{
        var list = JSON.parse(list_from_redis);
      }catch(e){
        console.log(e);
        return false;
      }
      if(msg != null && msg != ''){
        deliverToClientSockets(list, msg);
      }
    }
  });
}

var addsocketsPerClient = function(userId, socketClientId){
  redisClient.get(listSocketsNamespace + userId, function(err, list_from_redis){
    if(list_from_redis != null){ // if has more than 1 socket, save it to the current list
      try{
        var list = JSON.parse(list_from_redis);
      }catch(e){
        console.log(e);
        return false;
      }
      if(list != null) list.push(socketClientId);
    }else{ // create new list
      list = [socketClientId];
    }
    redisClient.setex(socketClientId, 86400, userId);
    redisClient.setex(listSocketsNamespace + userId, 86400, JSON.stringify(list));
  });
}

var addOperation = function(obj){
  redisClient.get("webapp:operations", function(err, list_from_redis){
    if(list_from_redis != null){ // if has more than 1 socket, save it to the current list
      try{
        var list = JSON.parse(list_from_redis);
      }catch(e){
        console.log(e);
        return false;
      }
      if(list != null) list.push(obj);
    }else{ // create new list
      list = [obj];
    }
    redisClient.setex("webapp:operations", 86400, JSON.stringify(list));
  });
}

var removeSocketPerClient = function(userId, socketClientId){
  redisClient.get(listSocketsNamespace + userId, function(err, list_from_redis){
    if(list_from_redis != null){
      try{
        var list = JSON.parse(list_from_redis);
      }catch(e){
        console.log(e);
        return false;
      }
      if(list instanceof Array){ // if valid list
        var socketIndex = list.indexOf(socketClientId);
        if(socketIndex > -1){ // remove it from array if in array
          list.splice(socketIndex, 1);
        }
        if(list.length == 0){ // empty list, delete entry from redis
          redisClient.del(listSocketsNamespace + userId);
        }else{ // store new list in redis
          redisClient.setex(listSocketsNamespace + userId, 86400, JSON.stringify(list));
        }
      }
    }
  });
}


module.exports.authorize_socket = function(){
  statics.list.sio.use(socketioJwt.authorize({ // socket io needs to be authorized
    secret: jwtSecret,
    handshake: true,
    timeout: 15000 // in ms = 15 secs
  }));
};

module.exports.socket_events = function(){
  statics.list.sio.sockets.on('connection', function(socket){ // connection is valid only if it's authenticated!
    var user_id = socket.decoded_token.id;
    if(user_id == null) return; // should never be the case
    var socketClientId = socket.client.id;
    console.log("user_id: " + user_id + ' want to use sockets!');
    addsocketsPerClient(user_id, socketClientId);
    socket.on('disconnect', function(socket){ // remove socket from list of sockets
      removeSocketPerClient(user_id, socketClientId);
    });
    socket.on('message', function(message){ // when socket client send a message, make possible to override user_id
      try{
        console.log("user_id: " + user_id);
        console.log("MESSAGE: " + message);
        if(message.toLowerCase() == 'help'){
          sendMessageToClientSockets(user_id, 'In order to send carbon credits to another user, you can send a stringified JSON payload like the following: {"to_id":2,"amount": 10} This will send 10 carbon credits to user ID 2');
        }else{
          var parsedMessage = JSON.parse(message);
          if(parsedMessage['user_id'] !== undefined && parsedMessage['user_id'] != "" && (parseInt(parsedMessage['user_id']) > 0) ){
            addsocketsPerClient(parseInt(parsedMessage['user_id']), socketClientId);
            removeSocketPerClient(user_id, socketClientId);
          }
          if(parsedMessage['to_id'] !== undefined && parsedMessage['to_id'] != "" && (parseInt(parsedMessage['to_id']) > 0)){
            if(parsedMessage['amount'] !== undefined && parsedMessage['amount'] != "" && (parseInt(parsedMessage['amount']) > 0)){
              redisClient.get(socketClientId, function(err, fromRedis){
                if(fromRedis != null){
                  addOperation({"from_id": parseInt(fromRedis), "to_id": parseInt(parsedMessage['to_id']), "amount": parseInt(parsedMessage['amount'])});
                }
              });
            }
          }
        }
      } catch(err){

      }
      // removeSocketPerClient(user_id, socketClientId);
    });
  });
};
