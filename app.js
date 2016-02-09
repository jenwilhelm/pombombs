var app = require('express')();
var _ = require('lodash');
var ig = require('instagram-node').instagram();
ig.use({access_token: process.env.IG_ACCESS_TOKEN});

var igAccounts = _.split(process.env.IG_ACCOUNTS, ',');

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send('Poms not bombs')
});

app.get('/random', function(req, res) {
  ig.user_media_recent(_.sample(igAccounts), function(err, pics) {
    var randomPic = _.sample(pics);

    return res.json({
      pom: randomPic.images.standard_resolution.url
    });
  });
});

app.get('/bomb', function(req, res) {
  ig.user_media_recent(_.sample(igAccounts), function(err, pics) {
    var imageUrlKey = 'images.standard_resolution.url';
    var randomPics = _.map(_.take(_.shuffle(pics), 5), imageUrlKey);

    return res.json({
      poms: randomPics
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Server listening on', app.get('port'));
});
