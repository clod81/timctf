# README

# remember to setup cronjob to run the rake tasks of the web app
# port to open externally: 4000, 4500, 9999


1 - race cond on start in withdrawn carbon credits... - TODO (maybe?)

  after signup, if submit start thing more than once, you can get balance more than once

2 - api or csv field thinge, override user_id in csv - IMPLEMENTED

  user_id,to_user_id,amount
  1,2,10

3 - websockets chat xss - unauthenticated (broadcast) - IMPLEMENTED

  (under message_socket/socket.io/examples/chat - node index.js - port 4500)

  need to run redis-prox as well, and allow external connections to port TCP 9999
  server needs to allow tcp from external aura ip on port 9999 (redis proxy address)

  need to start messages redis server with:
  redis-server --port 6399

  in redis only commands allowed are pubsub and publish
  pubsub channels
  publish 'webapp:messages' 'data'

  from websocket terminal:
  /connect ws://192.168.0.25:4500/socket.io/?EIO=3&transport=websocket

  from node
  npm install socket.io-client

    var socket = require('socket.io-client')('https://wallet.carbo.nz:4500');
    socket.on('connect', function(){
      socket.emit("message", "<script>alert(1)</script>");
    });
    socket.on('event', function(data){
      console.log(data);
    });


4 - websockets authenticated with a jwt and extra user_id: hidden functionality... - IMPLEMENTED
  port 4000


etherium

- the web app will have an account on etherium a big chunck of ether to start with

personal.newAccount()
=> 0xd9f5634ca7c211d0ea17e5e8b9df2de261db1524

- sign up flow
  user signup on web app
  create user on ehterium, and send ether from webapp account to individual user on etherium
  user will use certificates to deposit carbon credit on their etherium account
  the app will listen for events and see if there are deposits for etherium addresses with registered users

  in the app you can send carbon credits to other users

  and you can withdrawn back to etherium (needs to be implemented in the web app, app just needs to ask for withdrawn etherium address) - race condition here...

- from mobile app users will claim carbon credits and if they insert whatever "eth address" in webapp created etherium user
  we send ether to the account, so we can send transactions
  a background process will go and check if there are deposits, and if yes, the carbon credits will be added to the webapp user

- app needs to create eth users on etherium (key)

- user address on etherium is hash of public key
credit does not go back to the etherium network until they withdrawn..
they need the address they want to send it to ()

- use web3 node for listening for events
