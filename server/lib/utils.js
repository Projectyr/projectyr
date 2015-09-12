var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
//var db = require('./db')

module.exports = {
// encryption to be called everytime a user logs in or signs up

hashPassword : function(password){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(password, null, null)
      .then(function(hash) {
        return hash;
      });
  },

  userDashboard: function(username) {
    var projects = Projects.getAllProjects(username);
    for(var project in projects) {
      project.skills = Skills.getProjectSkills(project.projects_id)
    }
    return projects;
  }

}


