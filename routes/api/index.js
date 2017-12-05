var router = require('express').Router();
var jwt    = require('jsonwebtoken');



router.use(function(req, res, next) {
  
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var key = req.headers['dashcode'];
  // decode token
  if (key === '4ECRz1zRyKj7ACsUb5HzXiI4Cf8c6Uwc' || req.originalUrl == '/api/event') {
    next();
  } else if (token) {

    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

/*router.use('/part', require('./part'));
router.use('/carac', require('./carac'));
router.use('/cc', require('./cc'));
router.use('/celltype', require('./cellType'));
router.use('/record', require('./record'));
router.use('/cell', require('./cell'));
router.use('/of', require('./of'));
router.use('/event', require('./event'));*/
router.use('/training', require('./training'));


module.exports = router;