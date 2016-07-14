var socketioJwt = require('socketio-jwt');
var statics = require('../statics');
var jwtSecret = statics.list.jwtSecret;
var socketsUtils = require('../utils/sockets_utils');

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
    socketsUtils.addsocketsPerClient(user_id, socketClientId);
    socket.on('disconnect', function(socket){ // remove socket from list of sockets
      socketsUtils.removeSocketPerClient(user_id, socketClientId);
    });
  });
};
