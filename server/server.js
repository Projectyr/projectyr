/* Server.js handles all client requests but doesn't touch the view directly outside of serving
 up the static files for the initial root 'GET' request.  It is responsible for
  utilizing the correct functions from the models to interact with the database. */

/* Importing Statements */ 
var express = require('express');
var jwt = require('jwt-simple');
var parse = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var db = require('database');
var Utils = require('./lib/utils.js'); 
/* Importing Models - all models are functions that interact with certain tables in the database */
var Users = require('./models/users.js');
var Skills = require('./models/skills.js');
var Projects = require('./models/projects.js');

var app = express();
/* Necessary for setting the secret for the JWT */
app.set('jwtTokenSecret', 'jmoney');
var port = 3000;

app.use(parse.urlencoded({extended: true}));
app.use(parse.json());
/* This is used to direct '/' request to client, so Angular can handle it */
app.use(express.static(__dirname + '/../client'));

app.post('/users/signin', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  /* Preliminary check to see if the username exists */
  Users.findUser(req.body.username)
    .then(function(user) {
      if (!user) {
        next(new Error('Username does not exist'));
      } else {
        bcrypt.compare(password, user.password, function(err, match){
          if (match) {
            var token = jwt.encode(username, 'jmoney');
            res.json({token: token, hasWIP: Projects.hasInProgress(user.user_id)});  
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
  /* Preliminary check for username availability */
  Users.findUser(newUser)
    .then(function(user) {
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
    }, function(error) {
      next(error);
    });
});

app.post('/projects/complete', function(req, res,next) {
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  var project = req.body;
  Projects.updateProject(project)
    .then(function() {
      console.log('Project update completed');
      res.json('Project update completed')
    })
});

app.post('/projects/create', function(req, res, next) {
  //assuming that req.body.projects = { project: { name: <projectname> ,  est: <estimated_time>, skills: { skillname: 0, skillname: 0 ... }  }
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  var project = req.body;
  //this is old code - you can refactor in a similar style to lines 107-111 to avoid callback hell
  // Users.findUserId(username)
  //   .then(function(userId) {
  //     Projects.duplicateProject(userId, project)
  //       .then(function(exist) {
  //         if (exist) {
  //           next(new Error('Project exists!'));
  //         } else {
  //           Projects.insertProject(userId, project)
  //             .then(function() {
  //               console.log('Insert project success!')
  //               Projects.hasInProgress(userId)
  //                 .then(function(hasWIP) {
  //                   res.json({hasWIP: hasWIP});
  //                 });
  //             });
  //         }
  //       }); 
  //     });
  Users.findUserId(username)
    .then(function(userId) {
      return Projects.duplicateProject(userId, project)
    })
    .then(function(exist) {
      if (exist) {
        next(new Error('Project exists!'));
      } else {
        Projects.insertProject(userId, project)
          .then(function() {
            console.log('Insert project success!')
            Projects.hasInProgress(userId)
              .then(function(hasWIP) {
                res.json({hasWIP: hasWIP});
              });
          });
      }
    }); 
});

/*  */
app.get('/projects/getAll', function(req, res) {
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  Users.findUserId(username)
    .then(function(userId) {
      Projects.getActiveProjects(userId)
        .then(function(projects) {
          var all = {};
          all.projects = projects;
          res.json(all);
        });
    });
});

app.post('/projects/timeAssign', function(req, res) {
  var username = jwt.decode(req.headers['x-access-token'], 'jmoney');
  /* expect req.body to be something similar to this: {project_name: 'Sudokool-Fangting', est_time: 100, act_time:50, skill1: 'CSS', skill2: 'HTML', skill3: 'other', time1: .00036, time2: 1, time3: .5} */
  var project = req.body;
  /* The logic in this chain of promises is meant to check if timeNum(time2, time3, ...) property exists.  If only one of three skills
    were submitted the project would only have a time1 property associated with corresponding skillNum(skill1 in this instance).  res.json
     is needed or else the server will hang and errors will be thrown */
  Users.findUserId(username)
    .then(function(userId) {
      Projects.findProjectId(userId, project.project_name)
        .then(function(projId) {
          console.log(project.skill1 + ' has been updated')
          Skills.updateSkillTime(project.skill1, projId, project.time1)
            .then(function() {
              if(project.skill2 && project.time2) {
                Skills.updateSkillTime(project.skill2, projId, project.time2)
                  .then(function() {
                    console.log(project.skill2 + ' has been updated');
                    if(project.skill3 && project.time3) {
                      Skills.updateSkillTime(project.skill3, projId, project.time3)
                        .then(function() {
                          console.log(project.skill3 + ' has been updated');
                          res.json('succeed');
                        })
                    } else {
                      res.json('succeed')
                    }
                  })
              } else {
                res.json('succeed');
              }
            })
        })
    })
});

app.listen(3000, function() {
  console.log('Listening to localhost, port #: ', + port);
});