var db = require('../db.js');
var Users = require('./users.js');
var Promise = require('bluebird');
//var Projects = require('./projects.js');

var Skills = module.exports = {
  getProjectSkills: function(projId) {
    return db.select()
      .from('skill_times')
      .where('projects_id', projId)
      .then(function(rows) {
        console.log("skills", rows)
        for(var row in rows) {
          row.skill_name = this.getSkillName(row.skills_id);
        }
        return rows;
      })
  },

  getSkillName: function(skillId) {
    return db.select()
      .from('skills')
      .where('skills_id', '=', skillId)
      .then(function(rows) {
        return rows[0].skills_name;
      })
  },

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

  insertSkill: function(skills) {
    var skillPromises = skills.map(function(skill) {
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

  updateSkillTime: function(skillName, projectId, time, userId) {
    return this.findSkill(skillName)
      .then(function(skillId) {
        db('skill_times').select().where('projects_id', '=', projectId).andWhere('skills_id', '=', skillId)
        .then(function(results) {
          return results[0];
        })
        .then(function(exists) {
          if(!exists) {
            return db('skill_times').insert({
              projects_id: projectId,
              act_time: 0,
              users_id: userId,
              skills_id: skillId
            })
            .then(function() {
              return db('skill_times').where('projects_id', '=', projectId)
                .andWhere('skills_id', '=', skillId)
                .increment('act_time', time);
            })
          } else {
            return db('skill_times').where('projects_id', '=', projectId)
              .andWhere('skills_id', '=', skillId)
              .increment('act_time', time);
          }
        })
      })
  }
}