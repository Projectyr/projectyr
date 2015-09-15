(function(){
  // this is a directive on the projectyr.dashboard module
  angular.module('projectyr.dashboard')

  .directive('timeTracker', timeTracker);

  function timeTracker ($interval, dateFilter) {
    function link (scope, element, attrs) {
      var update;
      var start;

      // updateTime is called to update the time so far when the time-tracker attr (= start) on the button is changed, it is called every second in line 42-44;
      function updateTime () {
        var diff = (new Date()).getTime() - start.getTime();
        var s = Math.floor(diff/1000) % 60;
        var m = Math.floor(diff/(1000 * 60)) % 60;
        var h = Math.floor(diff/(1000 * 60 * 60)) % 60;

        element.text(h + "h : " + addZero(m) + "m : " + addZero(s) + "s");
      };

      // add 0 for minutes and seconds when they are less than 10
      // eg. 1 h 1 m 1 s >>> 1 h 01 m 01 s
      function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
      };

      // time-tracker was used in dashboard.html to hold live time, update the value on the button
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