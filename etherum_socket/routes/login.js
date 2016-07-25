var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var redis = require('redis');
var jwt = require('jsonwebtoken');
var statics = require('../statics');

var jwtSecret = statics.list.jwtSecret;
var redisReadWrite = statics.list.redisClient;  // normal read and write client

/* POST login - authenticate the user to user the websocket */
router.post('/', function(req, res){
  token_param = req.param('token');
  redisReadWrite.get("user:notifier:" + token_param, function(err, user_id_from_redis){
    if(user_id_from_redis == null) return false;
    var user_id = user_id_from_redis.toString();
    if(user_id != true){
      var user = {id: user_id};
      var token = jwt.sign(user, jwtSecret, { expiresInMinutes: 60*60 }); // we are sending the user in the token
      redisReadWrite.del("user:notifier:" + token_param);
      redisReadWrite.del("user:notifier:" + user_id);
      // console.log("post in login");
      res.json({token: token});
    }
  });
});

module.exports = router;
