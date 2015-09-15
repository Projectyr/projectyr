(function(){

  angular.module('projectyr.auth', [])

  .controller('AuthController', AuthController);

  function AuthController ($scope, $window, $location, Auth) {
    $scope.user = {};
    $scope.user.err = '';
    
    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (token) {
          // set user's localstorage token to allow user to be authorized to browser other web pages
          // also direct user to create their first project
          $window.localStorage.setItem('projectyr', token);
          $location.path('/create');
        })
        .catch(function(error){
          console.log("error", error)
          // check error to display different Error to user
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
          // server send an Object that has token and boolean hasWIP throught Auth factory signin function
          // if user does not have WIP project, direct user to create a project
          $window.localStorage.setItem('projectyr', data.token);
          if ( !!data.hasWIP ) {
            $location.path('/dashboard');
          } else {
            $location.path('/create');
          }
        })
        .catch(function(error) {
          console.log("error", error)
          // check error to display different Error to user
          if ( error.data.indexOf('not exist') > -1 ) {
            $scope.user.err = 'Error: Username does not exist'
          } else {
            $scope.user.err = 'Error: Invalid password';
          }
        });     
    };
  };

})();