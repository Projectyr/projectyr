(function(){

  angular.module('projectyr.service')
  .factory('Project', Project);

  function Project ($http, $location, $window) {
    var create;
    var getAll;
    // require server to send the new project data over
    function create (project) {
      return $http({
        method: 'POST',
        url: '/projects/create',
        data: project
      })
      .then(function(resp) {
        return resp.data.all;
      });
    };

    function getAll () {
      return $http({
        method: 'GET',
        url: '/projects/getAll',
      })
      .then(function(resp){
        return resp.data;
      })
    }

    return {
      create: create,
      getAll: getAll
    }
  };


})();