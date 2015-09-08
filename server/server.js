/* Import Statements */ 
var express = require('express');
var jwt = require('jwt-simple');
var parse = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
//var db = require('database');
//var Users = require('./models/users.js');
//var Tables = require('./models/tables.js');
//var Skills = require('./models/skills.js');
//var Projects = require('./models/projects.js');
//var utils = require('./lib/utils.js'); 

var app = express();

app.set('jwtTokenSecret', 'jmoney');
var port = 3000;

/* Notes:
    -app.set() for views/view engine is unnecessary because FE is using Angular

   Questions:

*/

app.get('/', function(req, res){
  res.send("<h1>Server is operational -- Projectyr</h1>");
})


app.post('/users/signin', function(req, res){
  // var username = req.body.username;
  // var password = req.body.password;
  //  
  // Users.checkUser(username)
  // if(true)
  //   Users.checkPassword(password)
  //   if(true)
  //    var token 
  //   
  //      
  // returns res.JSON({token: JWT variable, hasWIP: hasWIPProjects});
});

app.post('/users/signup', function(req, res){
  /* Grab inputted username & password, adds them to database
    and sends back JWT token <---(res.JSON wrapper function)

     var newUser = req.body.username;
     var newPass = req.body.password;

     hash newPass
     

     then add User
     Users.addUser(newUser, newPass) */
});

app.post('/projects/create', function(req, res){
  /* 
  define variables & store project info into database
    --adding/storing projects based on username? 
      var projTitle (?) = req.body.?

  Projects.addProject()

  */
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
    --inside Users model
    --checks to see if username is not already taken
      if(no)
        add username + hashed password to database
*/




app.listen(3000, function() {
  console.log("Listening to localhost, port #: ", + port);
});
