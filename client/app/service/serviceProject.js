(function(){
  
  angular.module('projectyr.service')
  .factory('Project', Project);

  function Project ($http, $location, $window) {
    // require server to send the new project data over
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

    function getAll () {
      return $http({
        method: 'GET',
        url: '/projects/getAll'
      })
      .then(function(resp){
        return resp.data;
      })
    };

    // require server to send over all the projects again
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

    function completeProject (project) {
      console.log("completeProject")
      return $http({
        method: 'POST',
        url: '/projects/complete',
        data: project
      })
      .then(function(resp){
        console.log("service", resp.data)
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