
$(document).on('ready page:load', function(){

  var burratinaioioioioioioioioiio = io.connect('http://192.168.0.25:4500');
  var lelelelelel = $('#whatisthis');

  // burratinaioioioioioioioioiio.on("connect", function(){
  //   burratinaioioioioioioioioiio.emit('message', "");
  // }

  burratinaioioioioioioioioiio.on('message', function(ASDSADSADADASDASDASDSADASDASDASDASDSADSADASDASDASDASDASDSADSADASDAS){
    var $el = $('<li>').html(ASDSADSADADASDASDASDSADASDASDASDASDSADSADASDASDASDASDASDSADSADASDAS);
    lelelelelel.append($el);
  });

});
