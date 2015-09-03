angular.module('projectyr', [
  'ui.router'
])
.config(config)
.factory('AttachTokens', AttachTokens)

function config($httpProvider, $stateProvider) {
  $stateProvider
    .state('signup', {
      templateUrl: 'app/auth/signup.html',
      url: '/signup',
      controller: 'AuthController'
    });

  // Add AttachTokens to $httpInterceptor, add token from local storage the to header of http request to server
  $httpProvider.interceptors.push('AttachTokens');
}

function AttachTokens ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
}