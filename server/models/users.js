var db = require('../db.js');

module.exports = {
  findUser: function(username) {
    //will return {user_id: '', username: '', password: ''}
    return db.select().from('users').where('username', username).then(function(results) {
      return results[0];
    })
  },

  findUserId: function(username) {
    return db.select().from('users').where('username', username).then(function(result) {
      return result[0].users_id;
    })
  },

  checkUser: function(username) {
  //returns a boolean if the username exists
    var dbUser = this.findUser(username);
    return dbUser ? true : false;
  },

  checkPassword: function(attemptedPassword, dbPassword) {
    return attemptedPassword === dbPassword;
  },

  insertUser: function(username, hashedPassword) {
    db('users').insert({username: username, password: hashedPassword})
      .then(function(){
        console.log("add new user");
      });
  }
  
}