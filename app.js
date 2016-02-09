var app = require('express')();
var _ = require('lodash');
var async = require('async');
var ig = require('instagram-node').instagram();
ig.use({access_token: process.env.IG_ACCESS_TOKEN});

var igAccounts = _.split(process.env.IG_ACCOUNTS, ',');

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res) {
  res.send('Poms not bombs')
});

app.get('/random', function(req, res) {
  ig.user_media_recent(_.sample(igAccounts), function(err, photos) {
    var pom = _.get(_.sample(photos), 'images.standard_resolution.url');

    return res.json({
      pom: pom
    });
  });
});

app.get('/bomb', function(req, res) {
  var count = _.get(req, 'query.count', 5);
  count = count > 100 ? 100 : count;

  getAllPhotoUrls(igAccounts, function(error, photoUrls) {
    var poms = _.take(_.shuffle(photoUrls), count);

    return res.json({
      poms: poms
    });
  });
});

function getAllPhotoUrls(accounts, callback) {
  var accountIds = _.clone(accounts);
  var photoUrls = [];
  var imageUrlKey = 'images.standard_resolution.url';

  async.each(accountIds, function(accountId, done) {
    ig.user_media_recent(accountId, function(err, photos) {
      photoUrls = _.concat(photoUrls, _.map(photos, imageUrlKey));
      return done();
    });
  }, function() {
    return callback(null, photoUrls);
  });
}

app.listen(app.get('port'), function() {
  console.log('Server listening on', app.get('port'));
});
