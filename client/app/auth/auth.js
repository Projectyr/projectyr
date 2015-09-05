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

    $scope.signin = function () {
      Auth.signin($scope.user)
        .then(function (data) {
          $window.localStorage.setItem('projectyr', data.token);
          if ( !!data.hasWIPProjects ) {
            $location.path('/dashboard');
          } else {
            $location.path('/');
          }
        })
        .catch(function(error) {
          if ( error.data.error.indexOf('No') > -1 ) {
            $scope.user.err = 'Error: Invalid password'
          } else {
            $scope.user.err = 'Error: ' + error.data.error;
          }
        });     
    };
  };

})();