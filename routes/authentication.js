var router = require('express').Router();
//var userService = require('../services/userService');
//var ldapService = require('../services/ldapService');
//var jwtService = require('../services/jwt.service');

var User = require('../models/user.model');


/*router.post('/', function(req, res) {
  ldapService.authentication(req.body.login,req.body.pass, function (auth) {
    if (!auth) {
      res.status(400).json({ success: false, message: 'Login ou mot de passe incorrect !' });
    }
    else {
      userService.getUser(req.body.login, function (err, user) {
        if (err) res.status(400).json({ success: false, message: err });
        else if (!user) res.status(400).json({ success: false, message: "Vous n'êtes pas autorisé à utiliser cette application" });
        else res.json({ success: true, message: err, user: user, token: jwtService.createToken(user, req.app.get('superSecret')) });
      })
    }
  })
});*/
router.get('/', function(req, res) {
  //var user = new User();
  new User({
    login: 'romain',
    password: 'pass',
    firstname: 'Romain',
    lastname: 'JANSSEN',
    groups: []
  })
  .save()
  .then(function (err) {
      console.log('ok')
      res.send('ok');
  })
});
router.post('/', function(req, res) {
  res.json({ success: true, message: err, user: user, token: jwtService.createToken(user, req.app.get('superSecret')) });
});

module.exports = router;