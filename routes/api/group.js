var router = require('express').Router();
var groupService = require('../../services/group.service');
var Group = require('../../models/group.model');

router.use(fileUpload());

router.get('/', function(req, res) {
  groupService.getAllGroup()
  .then(groups => {
    res.json(groups)
  })
  .catch(err => {
    res.sendStatus(400).json({error: err})
  })
});

router.post('/', function(req, res) {
  groupService.addGroup(req.body)
  .then(group => {
    res.sendStatus(201)
  })
  .catch(err => {
    res.status(400).json({error: err})
  })
});

router.patch('/', function(req, res) {
  groupService.updateGroup(req.body)
  .then(group => {
    res.sendStatus(200)
  })
  .catch(err => {
    res.status(400).json({error: err})
  })
});

router.delete('/', function(req, res) {
  groupService.deleteGroup(req.query)
  .then(group => {
    res.sendStatus(200)
  })
  .catch(err => {
    res.status(400).json({error: err})
  })
});

module.exports = router;