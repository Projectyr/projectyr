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

app.use(parse.urlencoded({extended: true}));
app.use(parse.json());
// this is used to direct "/" request to client, so Angular can handle it
app.use(express.static(__dirname + '/../client'));

app.post('/users/signin', function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  
  Users.findUser(req.body.username)
    .then(function(user) {
      if (!user) {
        next(new Error('Username does not exist'));
      } else {
        bcrypt.compare(password, user.password, function(err, match){
          if (match) {
            var token = jwt.encode(username, 'jmoney');
            res.json({token: token, hasWIP: Projects.hasInProgress(username)});  
          } else {
            next(new Error('Invalid password!'));
          }
        });
      }
    }, 
    function(error) {
      next(error);
    });
});

app.post('/users/signup', function(req, res, next) {
  var newUser = req.body.username;
  var newPass = req.body.password;
  
  Users.findUser(newUser)
    .then(function(user){
      if (user) {
        next(new Error('Username is taken!'));
      } else {
        Utils.hashPassword(newPass)
          .then(function(hash) {
            Users.insertUser(newUser, hash);
          })
          .then(function() {
            var token = jwt.encode(newUser, 'jmoney');
            res.json({token: token});
          })
      }
    }, function(error){
      next(error);
    });
});

app.post('/projects/create', function(req, res, next){
  //assuming that req.body.projects = { project: { name: <projectname> ,  est: <estimated_time>, skills: { skillname: 0, skillname: 0 ... }  }
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  var project = req.body;
  Users.findUserId(username)
    .then(function(userId){
      Projects.duplicateProject(userId, project)
        .then(function(exist) {
          if (exist) {
            next(new Error('Project exists!'));
          } else {
            Projects.insertProject(userId, project)
              .then(function(){
                console.log("Insert project success!")
                Projects.hasInProgress(userId)
                  .then(function(hasWIP){
                    res.json({hasWIP: hasWIP});
                  });
              });
          }
        }); 
      });
});

app.get('/projects/getAll', function(req, res) {
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  Users.findUserId(username)
    .then(function(userId){
      Projects.getActiveProjects(userId)
        .then(function(projects){
          var all = {};
          all.projects = projects;
          res.json(all);
        });
      });
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
});

app.listen(3000, function() {
  console.log("Listening to localhost, port #: ", + port);
});