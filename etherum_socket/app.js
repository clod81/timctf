// REQUIRES
// https://gist.github.com/jarvys/11393385

var http = require('http');
var express = require('express');
var app = express();
var io = require('socket.io')(http);
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// STATIC
var router = express.Router();
var server = http.createServer(app);
var statics = require('./statics');

// CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*" );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// app settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// routes
var index = require('./routes/index');
var login = require('./routes/login'); // login to authenticate client
app.use('/', index);
app.use('/login', login)


// SOCKET PART
var sio = io.listen(server);
statics.list.io  = io;  // set the io  to the list of our static vars
statics.list.sio = sio; // set the sio to the list of our static vars
var sio_handler = require('./routes/sio');
sio_handler.authorize_socket();
sio_handler.socket_events();

// REDIS PART
require('./redis/redis_handler').init();



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
});
});

server.listen(process.env.PORT || 4000);
