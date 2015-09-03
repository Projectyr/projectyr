(function(){

  angular.module('projectyr.service', [])

  .factory('Auth', Auth);

  function Auth ($http, $location, $window) {

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

    function isAuth () {
      return !!$window.localStorage.getItem('projectyr');
    };

    return {
      signup: signup,
      isAuth: isAuth
    };
  };

})();