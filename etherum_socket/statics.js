var redis = require('redis');

module.exports.list = {
  jwtSecret:   'fioasddsadasaaaaaaaaaaaxxxsdasdas312ed3$CGF%@$CF#rf431rc`2rdx$~#12132132@$$R#$@EDSASAAWD@!23d23d23d32d4457897b6v5c46v7b8v653vg%^$T',
  io:  null, // set by the app on init
  sio: null, // set by the app on init
  operationsRedisNamespace: 'socket:send:action:',
  redisClient: redis.createClient() // used to read and write into redis, not the subscriber
};
