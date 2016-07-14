var forever = require('forever-monitor');

var child = new (forever.Monitor)('./bin/www', {
  max: 3, // max restart tries
  silent: false,
  options: []
});

child.on('exit', function () {
  console.log('your-filename.js has exited after 3 restarts');
});

child.start();
