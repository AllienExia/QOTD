var router = require('express').Router();
var authService = require('../services/auth.service');
//var ldapService = require('../services/ldapService');
//var jwtService = require('../services/jwt.service');

var User = require('../models/admin.model');
var Training = require('../models/training.model');

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
  new Training({
    name: 'Formation 2'
  })
  .save()
  .then(function (err) {
      console.log('ok')
      res.send('ok');
  })
});
router.post('/', function(req, res) {
  if (req.body.type == 'admin') {
    authService.checkAdmin(req.body)
    .then(admin => {
      if (admin != null) {
        res.json({ success: true, message: null, admin: admin, token: authService.createToken(admin, req.app.get('superSecret')) });
      } else {
        res.status(400).json({ success: false, message: 'Login ou mot de passe incorrect !', admin: admin, token: null });
      }
    })
    .catch(err => {
      res.status(400).json({error: err})
    })
  } else {
    authService.checkClient(req.body)
    .then(admin => {
      res.json(admin)
    })
    .catch(err => {
      res.status(400).json({error: err})
    })
  }
});

module.exports = router;