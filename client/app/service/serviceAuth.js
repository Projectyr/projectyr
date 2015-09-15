(function(){

  angular.module('projectyr.service', [])

  .factory('Auth', Auth)

  function Auth ($http, $location, $window) {
    // signup requires server send over a token attach to data and pass it over to controller
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

    // signin require server send over data with token and hasWIP and hand them over to controller
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

    // check if a user is authorized when user switch pages on app
    function isAuth () {
      return !!$window.localStorage.getItem('projectyr');
    };

    // signout user by removing token that is stored in the client's localStorage
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