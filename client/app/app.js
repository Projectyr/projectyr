(function(){

  angular.module('projectyr', [
    'projectyr.service',
    'projectyr.auth',
    'projectyr.create',
    'projectyr.dashboard',
    'ngRoute',
    'ui.router'
  ])
  .config(config)
  .factory('AttachTokens', AttachTokens);

  function config($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

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
      .state('signin', {
        templateUrl: 'app/auth/signin.html',
        url: '/signin',
        controller: 'AuthController'
      })
      .state('create', {
        templateUrl: 'app/create/create.html',
        url: '/create',
        controller: 'CreateController'
      })
      .state('start', {
        templateUrl: 'app/dashboard/start.html',
        url: '/start',
        controller: 'DashboardController'
      })
      .state('dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        url: '/dashboard',
        controller: 'DashboardController'
      })
      .state('signout', {
        templateUrl: 'app/auth/home.html',
        url: '/signout',
        controller: 'AuthController',
        resolve: {function (Auth) {
          Auth.signout();
        }}
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