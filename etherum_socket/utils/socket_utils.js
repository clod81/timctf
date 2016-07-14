var statics = require('../statics');
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

module.exports.sendMessageToClientSockets = function(userId, msg){
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

module.exports.addsocketsPerClient = function(userId, socketClientId){
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
    redisClient.setex(listSocketsNamespace + userId, 86400, JSON.stringify(list));
  });
}

module.exports.removeSocketPerClient = function(userId, socketClientId){
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
