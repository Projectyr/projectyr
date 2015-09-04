var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var db = require('./db')


//compare function

exports.comparePassword = function (attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, user.get('password'), function(err, isMatch) {
    callback(isMatch);
    });
  },


// encryption
exports.hashPassword = function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(password, null, null).bind(user)
      .then(function(hash) {
        user.set('password', hash);
      });
  }




module.exports = utils