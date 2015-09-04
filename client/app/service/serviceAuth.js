(function(){

  angular.module('projectyr.service', [])

  .factory('Auth', Auth)

  function Auth ($http, $location, $window) {

    // signup requires server send over a token attach to data
    function signup (user) {
      return $http({
        method: 'POST',
        url: '/users/signup',
        data: user
      })
      .then(function(resp) {
        return resp.data.token;
      });
    };

    // signin require server send over data with token and hasWIPProjects
    function signin (user) {
      return $http({
        method: 'POST',
        url: '/users/signin',
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
    };

    function isAuth () {
      return !!$window.localStorage.getItem('projectyr');
    };

    return {
      signup: signup,
      signin: signin,
      isAuth: isAuth
    };
  };

})();