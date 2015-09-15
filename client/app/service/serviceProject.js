(function(){
  
  angular.module('projectyr.service')
  .factory('Project', Project);

  function Project ($http, $location, $window) {
    // require server to send a boolean to indicated if the user has with in progress project, and hand it over to controller
    function create (project) {
      return $http({
        method: 'POST',
        url: '/projects/create',
        data: project
      })
      .then(function(resp) {
        console.log("Create new project");
        return resp.data.hadWIP;
      });
    };

    // get all the WIP projects for the user
    function getAll () {
      return $http({
        method: 'GET',
        url: '/projects/getAll'
      })
      .then(function(resp){
        return resp.data;
      })
    };

    // timeData is an object liek a project, but has time1/2/3 properties indicating the time assigned on each skill, server send over a string.
    function timeAssign (timeData) {
      return $http({
        method: 'POST',
        url: '/projects/timeAssign',
        data: timeData
      })
      .then(function(resp){
        return resp.data;
      })
    };

    // completeProject send the completed project to the server.
    function completeProject (project) {
      return $http({
        method: 'POST',
        url: '/projects/complete',
        data: project
      })
      .then(function(resp){
        return resp.data;
      })
      .catch(function(err){
        console.log("completeProject Error: ", err)
      })
    };

    return {
      create: create,
      getAll: getAll,
      timeAssign: timeAssign,
      completeProject: completeProject
    }
  };

})();