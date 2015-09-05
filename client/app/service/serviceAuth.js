(function(){

  angular.module('projectyr.service', [])

  .factory('Auth', Auth)

  function Auth ($http, $location, $window) {
    var signup;
    var signin;
    var isAuth;
    var signout;
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

    function signout () {
      $window.localStorage.removeItem('projectyr');
      $location.path('/home');
    };

    return {
      signup: signup,
      signin: signin,
      isAuth: isAuth,
      signout: signout
    };
  };

})();