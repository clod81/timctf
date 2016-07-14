# README

1 - race cond on start with balance... - IMPLEMENTED
  after signup, if submit start thing more than once, you can get balance more than once

2 - api or csv field thinge, override user_id in csv - IMPLEMENTED

  user_id,to_user_id,amount
  1,2,10

3 - websockets chat xss - unauthenticated (broadcast) - IMPLEMENTED
  (under message_socket_working/socket.io/examples/chat - node index.js - port 4500)
  need to start redis server on redis-server --port 6399
  in redis
  pubsub channels
  publish 'webapp:messages' 'data'

  from websocket terminal:
  /connect ws://192.168.0.25:4500/socket.io/?EIO=3&transport=websocket

  from node
  npm install socket.io-client

    var socket = require('socket.io-client')('http://192.168.0.25:4500');
    socket.on('connect', function(){
      socket.emit("message", "<script>alert(1)</script>");
    });
    socket.on('event', function(data){
      console.log(data);
    });


4 - websockets authenticated with a jwt and extra user_id: hidden functionality

5 - mmmm maybe service workers xss somehow if have time?
