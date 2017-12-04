var Admin = require('../models/admin.model');

var jwt = require('jsonwebtoken');

function createToken(user, secret) {
  return jwt.sign(user, secret, {
    expiresIn : 60*60*24
  });
}
function checkAdmin(params) {
    return new Promise(function(resolve, reject) {
      Admin.findOne({"login": params.login, "password": params.password}).lean()
      .exec(function (err, admin) {
          if (err) reject(err);
          else resolve(admin);
      })
  }) 
}
function checkClient(params) {
    return new Promise(function(resolve, reject) {
      Admin.findOne({"login": params.login, "password": params.password}).lean()
      .exec(function (err, admin) {
          if (err) reject(err);
          else resolve(admin);
      })
  }) 
}
////////////////////////////////////////////

var self = {
    createToken: createToken,
    checkAdmin: checkAdmin,
    checkClient: checkClient
};

module.exports = self;