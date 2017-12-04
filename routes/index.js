var router = require('express').Router();

router.use('/api', require('./api'));
router.use('/authentication', require('./authentication'));

module.exports = router;