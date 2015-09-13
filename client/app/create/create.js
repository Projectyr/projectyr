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
      Project.create($scope.project)
        .then(function (hasWIP) {
          console.log('hi')
          $location.path('/dashboard');
        }) 
        .catch(function(err){
          console.log(err);
          if (err.data.indexOf("exists")) {
            $scope.project.err = 'Error: Project exists!' 
          }
        })
    };

  };

})();