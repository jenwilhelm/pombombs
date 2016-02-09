var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send('Poms not bombs')
});


app.listen(app.get('port'), function() {
  console.log('Server listening on', app.get('port'));
});
