//requires db connections and Users
//knex builds off of Bluebird for promises

var db = require('../db.js');
var Users = require('./users.js');
var Promise = require('bluebird');

//skill exports
//To Do: abstract queries in server.js and add them here

var Skills = module.exports = {

  //not being used: query getting project skills from join table skill time--functionality in server.js
  // getProjectSkills: function(projId) {
  //   return db.select()
  //     .from('skill_times')
  //     .where('projects_id', projId)
  //     .then(function(rows) {
  //       for(var row in rows) {
  //         row.skill_name = this.getSkillName(row.skills_id);
  //       }
  //       return rows;
  //     })
  // },


  //not being used query searching skills by name

  // getSkillName: function(skillId) {
  //   return db.select()
  //     .from('skills')
  //     .where('skills_id', '=', skillId)
  //     .then(function(rows) {
  //       return rows[0].skills_name;
  //     })
  // },

  //searches skill table: checks for existence of skill and returns skill if not boolean. used in insertSkill

  findSkill: function(skillName) {
    return db.select()
      .from('skills')
      .where('skills_name', skillName)
      .then(function(result) {
        if(result.length) {
          return result[0].skills_id
        } else {
          return false;
        }
      })
  },
  //To Do: abstract out skillId and SkillTimes query
  //takes an array of projects and searches for the time for each skill
  //Maps out two promises: promise for the array of objects and promise for each skill in the projects.
  //if there is a skill, does a query in project times for actual time. returns a promise, and increments time by 3600 to show up on DB rounding. All promises must return a result.
  getSkillTime: function(projects) {
    var skillTimePromises = projects.map(function (project) {
      var skills = ['skill1', 'skill2', 'skill3'];
        var skillsPromises = skills.map(function(skill){
          if (project[skill]) {
            return db.select('skills_id')
                     .from('skills')
                     .where('skills_name', project[skill])
                     .then(function (skillId) {
                       skillId = skillId[0].skills_id;
                       return  db.select()
                                 .from('skill_times')
                                 .where('projects_id', project.projects_id)
                                 .andWhere('skills_id', skillId)
                                 .then(function (skillTimes) {
                                  var time = 0;
                                  for (var i = 0; i < skillTimes.length; i ++) {
                                      time += skillTimes[i].act_time ? skillTimes[i].act_time : 0;
                                  };
                                    project[project[skill]] = time/3600;
                                    if (project.act_time) {
                                        project.act_time += time/3600;
                                    } else {
                                           project.act_time = time/3600;
                                    }
                                    return projects;
                                 });
                      });
          };
        });
      return Promise.all(skillsPromises)
                    .then(function(){
                      return projects;
                    });
    });
   return Promise.all(skillTimePromises)
                 .then(function(){
                  return projects;
                 });
  },

//inserts a skill into database; takes an array of skills from client. maps each skill and promisifies it.
  insertSkill: function(skills) {
    var skillPromises = skills.map(function (skill) {
      return Skills.findSkill(skill)
        .then(function(skillId){
          if (!skillId) {
            return db('skills').returning("skills_name").insert({ skills_name: skill })
              .then(function(name) {
                return true;
              });
          } else {
            return true;
          }
        })
    });
    return Promise.all(skillPromises);
  },
//updates the skill time from the user, takes the object from client and inserts the field to the database. queries done in promises. To Do: Abstract out. Math.round allows time to show in db
  updateSkillTime: function(skillName, projectId, time, userId) {
    time = Math.round(time * 3600);
      return this.findSkill(skillName)
                 .then(function (skillId) {
                  db('skill_times').select().where('projects_id', '=', projectId).andWhere('skills_id', '=', skillId)
                  .then(function (results) {
                    return results[0];
                  })
                  .then(function (exists) {
                    if(!exists) {
                      return db('skill_times')
                               .insert({
                                projects_id: projectId,
                                act_time: 0,
                                users_id: userId,
                                skills_id: skillId
                               })
                      .then(function() {
                      return db('skill_times')
                              .where('projects_id', '=', projectId)
                              .andWhere('skills_id', '=', skillId)
                              .increment('act_time', time);
                      })
                    } else {
                      return db('skill_times')
                                .where('projects_id', '=', projectId)
                                .andWhere('skills_id', '=', skillId)
                                .increment('act_time', time);
                    }
                  })
                })
  }
  
}
