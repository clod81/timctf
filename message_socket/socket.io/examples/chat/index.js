// Setup basic express server
// START REDIS-SERVER like this: redis-server --port 6399

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
var redis = require('redis');
var port = process.env.PORT || 4500;

var redisSubscriber = redis.createClient(6399, '127.0.0.1');
var redisClient     = redis.createClient(6399, '127.0.0.1');

redisSubscriber.on('ready', function(){
  redisSubscriber.subscribe('webapp:messages');
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

function escapeHtml(unsafe){
  return unsafe
   .replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&#039;");
 }

io.on('connection', function(socket){
  console.log("connection");
  socket.on('message', function(data){
    console.log("message received from client: " + data);
    redisClient.publish('webapp:messages', escapeHtml(data));
  });
});

redisSubscriber.on("message", function(channel, message){
  console.log("message in redis: " + message);
  io.sockets.emit('message', message);
});
