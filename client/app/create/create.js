(function(){

  angular.module('projectyr.create', [])

  .controller('CreateController', CreateController);

  function CreateController ($scope, $window, $location, Project, Auth) {
    $scope.skills = ["Javascript", "CSS", "HTML", "Ruby", "Other"];

    $scope.project = {};

    $scope.$watch(Auth.isAuth, function(authed){
        if (authed) {
          $location.path('/create');
        } else {
          $location.path('/signin')
        } 
      }, true);

    $scope.create = function () {
      console.log('project');
      Project.create($scope.project)
        .then(function (project) {
          $location.path('/dashboard');
        }) 
        .catch(function(err){
          console.log(err);
          $scope.project.err = 'Error: ' + err.data.error;
        })
    };

  };

})();