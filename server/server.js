/* Import Statements */ 
var express = require('express');
var jwt = require('jwt-simple');
var parse = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var db = require('database');
var Users = require('./models/users.js');
var Skills = require('./models/skills.js');
var Projects = require('./models/projects.js');
var Utils = require('./lib/utils.js'); 

var app = express();

app.set('jwtTokenSecret', 'jmoney');
var port = 3000;

app.get('/', function(req, res){
  res.send("<h1>Server is operational -- Projectyr</h1>");
});


app.post('/users/signin', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var user = Users.findUser(req.body.username);
  //did the user enter a valid username?
  if(!user[0]) {
    res.send('username does not exist');
  } else {
    //did the submitted password match the password stored in the database?
    var submittedPassword = Utils.hashPassword(req.body.password);
    if(Users.checkPassword(submittedPassword, user.password)) {
      var token = jwt.encode(username, 'jmoney');
      res.JSON({token: token, hasWIP: Projects.hasInProgress(username)});
    } else {
      res.send('invalid password');
    }
  }
});

app.post('/users/signup', function(req, res){
  var newUser = req.body.username;
  var newPass = req.body.password;
  //does the username already exist?
  if(!Users.findUser(newUser)) {
    res.send('username is taken, please choose another');
  } else {
    Utils.hashPassword(newPass)
      .then(function(hash) {
        Users.insertUser(newUser, hash);
      })
      .then(function() {
        var token = jwt.encode(username, 'jmoney');
        res.JSON({token: token});
      })
  }
});

app.post('/projects/create', function(req, res){
  //assuming that req.body.projects = { project: { name: <projectname> ,  est: <estimated_time>, skills: { skillname: 0, skillname: 0 ... }  }
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  var project = req.body.project;
  
  if(Projects.duplicateProject(username, project)) {
    res.send('Project already exists.')
  } else {
    Projects.insertProject(username, project);
    res.send('success')
  }
});

app.get('/dashboard', function(req, res) {
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  res.JSON({projects: Utils.userDashboard(username)});
});

app.post('/dashboard', function(req, res) {
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  var projects = req.body.project;

  for(var project in projects) {
    var projId = Projects.findProjectId(username, project.name);
    for(var skill in project.skills) {
      Skills.updateSkillTime(skill, projId, project.skills[skill]);
    }
  }
  res.send('success');
})

app.listen(3000, function() {
  console.log("Listening to localhost, port #: ", + port);
});