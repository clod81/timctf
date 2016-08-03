var net = require('net');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var web3IPC = new Web3(new Web3.providers.IpcProvider("/home/ccontin/.ethereum/geth.ipc", net.Socket()));
var redis = require('redis');
var redisClient = redis.createClient();
var redisSubscriber = redis.createClient();
var redisSubscriberTransactions = redis.createClient();

// geth --networkid=99 --rpc --rpccorsdomain=*.carbo.nz
// geth --networkid=99 --rpc --rpccorsdomain=*.carbo.nz --unlock 0xd9f5634ca7c211d0ea17e5e8b9df2de261db1524 --rpcapi eth,net,web3,personal
// geth --networkid=99 --rpc --rpccorsdomain=*.carbo.nz --rpcapi eth,net,web3,personal

// geth --preload carbonz-context.js attach
// https://docs.carbo.nz/manual/checking-and-transferring-credits.html

var GlobalRegistrarContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"name","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"content","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"subRegistrar","outputs":[{"name":"o_subRegistrar","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_registrar","type":"address"}],"name":"setSubRegistrar","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"Registrar","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"},{"name":"_primary","type":"bool"}],"name":"setAddress","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_content","type":"bytes32"}],"name":"setContent","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"disown","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"register","outputs":[{"name":"","type":"address"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"}],"name":"PrimaryChanged","type":"event"}]);

var registrar = GlobalRegistrarContract.at("0xda9431e834583376949385b83a3ee65c51deecc2");

var CarboNZContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"participants","outputs":[{"name":"","type":"bytes"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"MintableToken","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"mint","type":"address"}],"name":"addMint","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"mint","type":"address"}],"name":"revokeMint","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"entityReference","type":"bytes"}],"name":"register","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint128"}],"name":"mint","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"}],"name":"Registration","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"quantity","type":"uint128"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]);

var CarboNZ = CarboNZContract.at(registrar.addr('carbonz'));

var CarboNZIssuerContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_signer","type":"address"}],"name":"setSignerAddress","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"}],"name":"checkReservation","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],"name":"setTokenAddress","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"signerAddress","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"recipient","type":"address"}],"name":"setRecipient","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"nonce","type":"uint128"},{"name":"quantity","type":"uint128"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"claimCertificate","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint128"}],"name":"usedNonces","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_token","type":"address"},{"name":"_signer","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"bytes32"},{"indexed":false,"name":"","type":"address"}],"name":"ClaimReservation","type":"event"}]);

var CarboNZIssuer = CarboNZIssuerContract.at(registrar.addr('carbonz-issuer'));

var eth = CarboNZ._eth;

var personal = web3IPC.personal;

// var transactions = [];

///// ************************************************************************************

redisSubscriber.on('ready', function(){
  redisSubscriber.subscribe('eth:create:account');
});

redisSubscriberTransactions.on('ready', function(){
  redisSubscriberTransactions.subscribe('eth:transaction');
});

// new user registration
redisSubscriber.on("message", function(channel, eth_address){
  console.log("going to send some ether to new user with address: " + eth_address);
  redisClient.get("eth:accounts", function(err, list_from_redis){ // keep track of all accounts in redis
    if(list_from_redis != null){
      try{
        var list = JSON.parse(list_from_redis);
      }catch(e){
        console.log(e);
        return false;
      }
      if(list != null) list.push(eth_address);
    }else{ // create new list
      list = [eth_address];
    }
    redisClient.set("eth:accounts", JSON.stringify(list));
  });
  redisClient.set("eth:account:" + eth_address, "0"); // set initial balance to 0
  personal.unlockAccount(eth.coinbase, '', function(){ // send some ether in order to allow user to then send some carcon credits
    eth.sendTransaction({from: eth.coinbase, to: eth_address, value: web3.toWei(1, "ether")});
  });
});

// new transaction
redisSubscriberTransactions.on("message", function(channel, trans){
  console.log("new transaction: " + trans);
  try{
    var t = JSON.parse(trans);
  }catch(e){
    console.log(e);
    return false;
  }
  personal.unlockAccount(t['from'], '', function(){
    CarboNZ.transfer.sendTransaction(t['to'], t['amount'], {from: t['from']});
  });
});


// listen for transaction events
var event = CarboNZ.Transfer();
event.watch(function(){
  console.log('new transaction confirmation');
});


// periodically check for balances, every 15 seconds
var balancer = function(){
  redisClient.get("eth:accounts", function(err, list_from_redis){ // keep track of all accounts in redis
    if(list_from_redis != null){
      try{
        var list = JSON.parse(list_from_redis);
      }catch(e){
        console.log(e);
        return false;
      }
      list.forEach(function(eth_address){
        redisClient.set("eth:account:" + eth_address, CarboNZ.balanceOf(eth_address).toString());
      });
    }
  });
};
setInterval(balancer, 15000);

console.log("listening for events");

// personal.unlockAccount(eth.accounts[0])
// CarboNZ.transfer.sendTransaction("RECIPIENT ADDRESS", AMOUNT, {from: eth.accounts[0]})
// CarboNZ.transfer.sendTransaction("0x0f12ea1a029dfea2c5ddfeeb6e8f072e692bd048", 1, {from: eth.accounts[0]})


// 0x16e17029d76d1123c50c3e38347b74d3f02dbada13efbc53590d45b311113a32
// eth.getTransactionReceipt(transactionId)
// eth.getTransactionReceipt("0x16e17029d76d1123c50c3e38347b74d3f02dbada13efbc53590d45b311113a32")

// send test carbon credits to last created user
// personal.unlockAccount(eth.coinbase, '')
// CarboNZ.transfer.sendTransaction(personal.listAccounts[personal.listAccounts.length - 1], 10, {from: eth.coinbase});
// CarboNZ.balanceOf(personal.listAccounts[personal.listAccounts.length - 1])
