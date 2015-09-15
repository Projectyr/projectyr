//initates DB connection

var db = require('../db.js');

//exports object: methods on users

module.exports = {
  findUser: function(username) {
    //will return {user_id: '', username: '', password: ''}
    //returns an array of objects only one object per user name
    return db.select().from('users')
            .where('username', username)
            .then(function(results) {
      return results[0];
    })
  },
  //returns user_id property

  findUserId: function(username) {
    return db.select().from('users')
             .where('username', username)
             .then(function(result) {
      return result[0].users_id;
    })
  },

  checkUser: function(username) {
  //returns a boolean if the username exists
    var dbUser = this.findUser(username);
    return dbUser ? true : false;
  },
//checkPassword functionality done by server.js bcrypt functionality. 
//To Do: move functionality to DB
  // checkPassword: function(attemptedPassword, dbPassword) {
  //   return attemptedPassword === dbPassword;
  // },

//insert query to DB. server will always pass a hashed password. Insert query expects a promise for resolution. Logs on success.
  insertUser: function(username, hashedPassword) {
    db('users').insert({username: username, password: hashedPassword})
      .then(function(){
        console.log("add new user");
      });
  }
  
}