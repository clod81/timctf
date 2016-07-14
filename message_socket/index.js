var express = require('express');
var app = express();

// ---

app.set('views', __dirname);
app.set('view engine', 'jade');

// ---

app.use(require('body-parser').urlencoded({extended: true}));

// ---

app.get('/', function(req, res) {
  var msg = req.query.msg;
	res.render('index', {message: msg});
});

// ---

var server = app.listen(4500, function () {
	console.log('listening on port %d', server.address().port);
});
