(function(){

  angular.module('projectyr.create', [])

  .controller('CreateController', CreateController);

  function CreateController ($scope, $window, $location, Project, Auth) {
    // hard coded skills for user to choose right now.
    // enhancement can be done here to allow user create customized skills
    $scope.skills = ["Javascript", "CSS", "HTML", "Ruby", "Other"];

    $scope.project = {};

    // make sure user is authorized when they access create page
    // direct user to signin if not authorized
    $scope.$watch(Auth.isAuth, function(authed){
        if (authed) {
          $location.path('/create');
        } else {
          $location.path('/signin')
        } 
      }, true);

    // send the user's project input to server
    // direct to dashboard when succeed
    $scope.create = function () {
      Project.create($scope.project)
        .then(function (hasWIP) {
          $location.path('/dashboard');
        }) 
        .catch(function(err){
          console.log("create new project err: ", err);
          if (err.data.indexOf("exists")) {
            $scope.project.err = 'Error: Project exists!' 
          }
        })
    };

  };

})();