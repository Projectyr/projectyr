var db = require('../db.js');
var Users = require('./users.js');
var Projects = require('./projects.js');

module.exports = {
  getProjectSkills: function(projId) {
    /*db('skill_times')
        .join('skills', 'skill_times.skills_id', '=', 'skills.skills_id')
        .select()
        .where('projects_id', projId)
        .then(function(rows) {
          return rows;
        });
        Should return: [{skills_id, skills_name, skill_times_id, act_time, users_id, projects_id}, ...]
     */
    return db.select()
      .from('skill_times')
      .where('projects_id', '=', projId)
      .then(function(rows) {
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
      .where('skills_name', '=', skillName)
      .then(function(result) {
        if(result.length) {
          return result[0].skills_id
        } else {
          return null;
        }
      })
  },

  insertSkill: function(skillName) {
    return db('skills').returning('skills_id').insert({skills_name: skillName})
      .then(function(id) {
        return id;
      });
  },

  updateSkillTime: function(skillName, projectId, time) {
    var skillId = this.findSkill(skillName);
    db('skill_times').where('projectId', '=', projectId)
      .andWhere('skills_id', '=', skillId)
      .increment('act_time', time);
  }
  
}