/* These are helper functions that don't necessarily interact with the database. */
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

module.exports = {
  hashPassword: function(password) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(password, null, null)
      .then(function(hash) {
        return hash;
      });
  }
}


