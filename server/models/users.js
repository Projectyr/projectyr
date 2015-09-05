var db = require('../db.js');
var _ = require('underscore')

module.exports = {
  //fill me in
  //db all row
  userIdQuery :  db.select('users_id').from('users'),
  userNameQuery : db.select('username').from('users'),
  passQuery : db.select('password').from('users'),

  //db specific row queries: returns value
  findUserId: function(id){
  	return this.userIdQuery.where(id)
  				.then( function (rows){	
 						return rows[0].users_id
  				})
  },

  findUser : function(user) {
  	return this.userNameQuery.where(user)
  				.then( function (rows){
  					return rows[0].username;
  				})
  },

  findPassword : function(pass){
  	return this.passQuery.where(pass);
  				.then( function (rows){
  				return rows[0].password;
  				})
  }

  //db check queries returns boolean
  checkUser: function(user) {
  	this.userIdQuery
  		.then( function (rows){
  			return _.contains(rows, user)
  		})
  	},

  checkPassword: function(pass){
  	this.passQuery
  		.then( function (rows){
  			return _.contains(rows, pass)
  		})
  }

};