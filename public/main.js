var client;
var rValue;
var gValue;
var bValue;

var mqttSetup = function() {
  client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt'); // you add a ws:// url here
  client.subscribe("jag/colors/#");

  client.on("message", function(topic, payload) {
    var rgb = payload.toString().split('.');
    var newRgb = 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
    $('#R').slider('setValue',parseInt(rgb[0]));
    $('#G').slider('setValue',parseInt(rgb[1]));
    $('#B').slider('setValue',parseInt(rgb[2]));
    $('#RGB').css('background', newRgb);
  });
}


var setupSlider = function() {

  var RGBChange = function() {
    var newRgb = 'rgb('+r.getValue()+','+g.getValue()+','+b.getValue()+')';
    $('#RGB').css('background', newRgb);

    var dontPublishAlot = debounce(function() {
      if (!client) {
         client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt'); // you add a ws:// url here
         client.subscribe("jag/colors/#");
      }
       client.publish("jag/colors",r.getValue()+'.'+g.getValue()+'.'+b.getValue());
    }, 5000);

    dontPublishAlot(r.getValue(), g.getValue(), b.getValue());

  };

  var r = $('#R').slider()
      .on('slide', RGBChange)
      .data('slider');
  var g = $('#G').slider()
      .on('slide', RGBChange)
      .data('slider');
  var b = $('#B').slider()
      .on('slide', RGBChange)
      .data('slider');

  rValue = r.getValue();
  gValue = r.getValue();
  bValue = r.getValue();
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

$( document ).ready(function() {
  setupSlider();
  mqttSetup();
});
