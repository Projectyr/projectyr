var db = require('../db.js');
var Users = require('./users.js');
var Skills = require('./skills.js');
var _ = require('../../node_modules/underscore/underscore.js');

module.exports = {
  getAllProjects: function(user) {
    var userId = Users.findUserId(user);
    return db.select()
      .from('projects')
      .where('users_id', '=', userId)
      .then(function(rows){
        return rows;
      });
  },

  getActiveProjects: function(user) {
    var userId = Users.findUserId(user);
    return db.select()
      .from('projects')
      .where('users_id', '=', userId)
      //we may have to change status to done, and the value might be true/false instead of active/complete
      .andWhere('done', '=', 'false')
      .then(function(rows){
        return rows;
      });
  },

  hasInProgress: function(user) {
    var projects = this.getActiveProjects(user);
    return projects.length > 0;
  },

  insertProject: function(userId, project) {
    //need req.body.project to be an object with the following format:  { name:, est:, skills: {skillname: 0, skillname2: 0, etc.}}
    return db('projects').returning("projects_id").insert({
        project_name: project.name, 
        est_time: project.estTime, 
        users_id: userId,
        skill1: project.skill1,
        skill2: project.skill2, 
        skill3: project.skill3})
        .then(function(projects) {
          for(var skill in project.skills) {
            var newSkill = Skills.findSkill(skill);
            if(!newSkill) {
              var skillID = Skills.insertSkill(skill);
              db('skill_times').insert({act_time: 0, users_id: userId, projects_id: projId, skills_id: skillID})
                .then(function(){
                  console.log("Insert a new skill time");
                });
            } else {
              db('skill_times').insert({act_time: 0, users_id: userId, projects_id: projId, skills_id: newSkill})
                .then(function(){
                  console.log("Insert a new skill time");
                });
            }
          }
        });
  },

  duplicateProject: function(userId, project) {
    return db.select()
      .from('projects')
      .where('users_id', userId)
      .andWhere('project_name', '=', project.name)
      .then(function(projects) {
        return projects.length > 0;
      });
  },

  findProjectId: function(user, project) {
    var userId = Users.findUserId(user);
    return db.select()
      .from('projects')
      .where('project_name', '=', project)
      .andWhere('users_id', '=', userId)
      .then(function(result) {
        result[0].projects_id;
      })
  }
}