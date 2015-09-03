(function(){
  angular.module('projectyr.service', [])

  .factory('Auth', Auth);

  function Auth ($http, $location, $window) {
    var signup;
    var isAuth;

    return {
      signup: signup,
      isAuth: isAuth
    };


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
  };

})