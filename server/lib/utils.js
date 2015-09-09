var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var db = require('./db')

module.exports = {



// encryption
hashPassword : function(user, password){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(password, null, null).bind(user)
      .then(function(hash) {
        return hash;
      });
  }

}


