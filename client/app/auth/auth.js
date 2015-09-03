(function(){

  angular.module('projectyr.auth', [])

  .controller('AuthController', AuthController);

  function AuthController ($scope, $window, $location, Auth) {
    $scope.user = {};
    $scope.user.err = '';
    
    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('projectyr', token);
          location.path('/create');
        })
        .catch(function(err){
          console.log(err);
          $scope.user.err = 'Error: ' + err.data.error;
        });
    };
  };

})();