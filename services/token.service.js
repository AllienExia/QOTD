var jwt = require('jsonwebtoken');

function createToken(user, secret) {
  return jwt.sign(user, secret, {
    expiresIn : 60*60*24
  });
}

////////////////////////////////////////////

var self = {
    createToken: createToken
};

module.exports = self;