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
          $location.path('/create');
        })
        .catch(function(error){
          if ( error.data.indexOf('taken') > -1 ) {
            $scope.user.err = 'Error: Username is taken'
          } else {
            $scope.user.err = 'Error: Invalid password';
          }
        });
    };

    $scope.signin = function () {
      Auth.signin($scope.user)
        .then(function (data) {
          console.log('client signin data', data)
          $window.localStorage.setItem('projectyr', data.token);
          if ( !!data.hasWIP ) {
            $location.path('/dashboard');
          } else {
            $location.path('/create');
          }
        })
        .catch(function(error) {
          console.log("error", error)
          if ( error.data.indexOf('not exist') > -1 ) {
            $scope.user.err = 'Error: Username does not exist'
          } else {
            $scope.user.err = 'Error: Invalid password';
          }
        });     
    };
  };

})();