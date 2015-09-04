(function(){

  angular.module('projectyr.create', [])

  .controller('CreateController', CreateController);

  function CreateController ($scope, $window, $location, Auth) {
    $scope.skills = ["Javascript", "CSS", "HTML", "Ruby", "Other"];

    $scope.project = {};

    $scope.create = function () {
      console.log('project');
    };

  };

})();