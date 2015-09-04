var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var now = require('date-time');
//var db = require('database');
//var Users = require('./models/users.js');
//var Tables = require('');
//var Skills = require('');
//var Projects = require('');
//var utils = require('./lib/utils.js'); 

/* Notes:
    -app.set() for views/view engine is unnecessary because FE is using Angular
    -(?) === "I think"

   Questions:
    
*/

app.post('/users/signin', function(req, res){
  // Users.checkUser()
  // if(true)
  //   Users.checkPassword()
  //   if(true)
  //   
  //      
  // returns res.JSON({token: JWT variable, hasWIP: hasWIPProjects});
});

app.post('/users/signup', function(req, res){
  /* var username = req.body.username;
     var password = req.body.password;

     Users.addUser(username, password)
});

/*
Routes:
  -/users
    --/signin
    --/signup
  -/projects
    --/create
  [^^^^^All POST requests^^^^^]



Data:
  -signup
    --Attach a token to the data object (JWT for User ID)
  -signin
    --Attach a token + hasWIPProjects() <--(boolean)

Functions:
  -hasWIPProjects()
      -inside Projects model

  -checkUser() 
    --inside Users model
    -- checks to see if the username exists
   if(yes)
      then check to see if password is correct
      if(yes)
        will create a JWT
  -addUser()
    --insdie Users model
    --checks to see if username is not already taken
      if(no)
        add username + hashed password to database
*/








app.listen(port);