var db = require('./db.js');
var _ = require('underscore');

module.exports = {
  //fill me in


  //db specific row queries: finds user ID
  findUserId: function(username){
  	return db.select().from('users').where(username)
  				.then( function (rows){	
 						return rows[0].users_id
  				})
  },



//retrieves user object: row with all user columns
  findUserByName : function(username) {
  	return db.select().from('users').where(user)
  				.then( function (rows){
  					return rows[0]
  				})
  },

  //check user exists, takes a username returns boolean
  checkUser: function(username) {
    var dbUser = this.findUser(username);
    return dbUser.username === username;
  	},

    //checks password: takes user name for objectquery and hashed password returns a boolean
  checkPassword: function(user, hashedPassword){
  	var dbUser = this.findUser(user)
  	return dbUser.password === hashedPassword
  		},

    //inserts a user into the database: takes a username from req.body and a hashedPassword
  insertUser: function(username, hashedPassword){
    return db.('users').insert({'username': username, 'password': hashedPassword})
              .then(resultArray){
              return resultArray
              }
  }

};