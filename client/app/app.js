(function(){

  angular.module('projectyr', [
    'projectyr.service',
    'projectyr.auth',
    'ngRoute',
    'ui.router'
  ])
  .config(config)
  .factory('AttachTokens', AttachTokens);

  function config($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('signup', {
        templateUrl: 'app/auth/signup.html',
        url: '/signup',
        controller: 'AuthController'
      })
      .state('home', {
        templateUrl: 'app/auth/home.html',
        url: '/home',
        controller: 'AuthController'
      })
      .state('create', {
        templateUrl: 'app/create/create.html',
        url: '/create'
        //controller: 'AuthController'
      })


    // Add AttachTokens to $httpInterceptor, add token from local storage the to header of http request to server
    $httpProvider.interceptors.push('AttachTokens');
  }

  function AttachTokens ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('projectyr');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  }

})();