var net = require('net');
var fs = require('fs');

var configFile = process.argv[2] || "config/config.json";
console.log('using '+ configFile + ' as configuration source');
var config = JSON.parse(fs.readFileSync(configFile));

var RedisProxy = require('./lib/redis_proxy');
var redis_proxy = new RedisProxy(config);
var bindAddress = config.bind_address || "127.0.0.1",
    listenPort = config.listen_port || 9999;

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

var redisInfo = [ '*1', '$4', 'AURA', '' ];

var server = net.createServer(function (socket) {
  try{
    var id = socket.remoteAddress+':'+socket.remotePort
    console.log('client connected ' + id);
    socket.on('end', function() {
      console.log('client disconnected');
      if(this._peername){
        redis_proxy.quit(this._peername.address+':'+this._peername.port);
      }
    });
  } catch(e){}

  socket.on('data', function(data) {
    try {
      var command = data.toString('utf8'), id = socket.remoteAddress+':'+socket.remotePort;
      var realCmd = command.split('\n')[2].trim().replace('\r', '');
      console.log(realCmd == 'pubsub');
      if(realCmd == 'pubsub' || realCmd == 'publish'){
        console.log("original command allowed: " + command);
      }else {
        command = redisInfo.join('\r\n');
        console.log("original command NOT allowed: " + command);
      }
      console.log("---------");
      redis_proxy.sendCommand(command, id, function(err, response) {
        if(response) response.unpipe();
        if(err){
          return socket.write("-ERR Error Happened "+ err);
        }
        response.pipe(socket);
      });
    } catch(e){}
  });
});

redis_proxy.watch();

server.listen(listenPort, bindAddress);
console.log("Redis proxy is listening on " +bindAddress+" : " + listenPort);
