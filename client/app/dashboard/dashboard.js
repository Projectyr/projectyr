(function(){
  angular.module('projectyr.dashboard', [])
  .controller('DashboardController', DashboardController)
  .directive('timeTracker', timeTracker);

  function DashboardController ($scope) {
    $scope.start = null;
    $scope.end = null;
    $scope.actTime = 0;

    $scope.startClock = function () {
      $scope.start = new Date();
      $scope.end = null;
    };

    $scope.endClock = function () {
      $scope.end = new Date();
      $scope.actTime = (($scope.end - $scope.start)/(1000*60*60)).toFixed(2);
      $scope.start = null;
    };
  };

  function timeTracker ($interval, dateFilter) {
    function link (scope, element, attrs) {
      var update;
      var start;
      function updateTime () {
        var diff = (new Date()).getTime() - start.getTime();
        var s = Math.floor(diff/1000) % 60;
        var m = Math.floor(diff/(1000 * 60)) % 60;
        var h = Math.floor(diff/(1000 * 60 * 60)) % 60;

        function addZero(i) {
          if (i < 10) {
              i = "0" + i;
          }
          return i;
        };

        element.text(h + "h : " + addZero(m) + "m : " + addZero(s) + "s");
      };

      scope.$watch(attrs.timeTracker, function(value) {
        start = value;
        updateTime(); 
      });
      
      element.on('$destroy', function() {
        $interval.cancel(update);
      });

      update = $interval(function() {
        updateTime();
      }, 1000);
    };

    return {
      link: link
    }

  };

})();