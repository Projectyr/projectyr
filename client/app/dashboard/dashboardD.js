(function(){
  angular.module('projectyr.dashboard')
  .directive('timeTracker', timeTracker);

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