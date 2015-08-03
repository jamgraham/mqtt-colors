var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.use('/slider', express.static(__dirname + '/node_modules/bootstrap-slider/dist/'));
app.use('/mqtt', express.static(__dirname + '/node_modules/mqtt/'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});