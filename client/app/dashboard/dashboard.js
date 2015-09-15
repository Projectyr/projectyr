(function(){
  angular.module('projectyr.dashboard', [])
  .controller('DashboardController', DashboardController);

  function DashboardController ($scope, Project, Auth, $location) {
    $scope.start = null;
    $scope.end = null;
    $scope.actTime = 0;

    // make sure user is authorized when they access create page
    // direct user to signin if not authorized
    $scope.$watch(Auth.isAuth, function(authed){
        if (authed) {
          $location.path('/dashboard');
        } else {
          $location.path('/signin')
        } 
      }, true);

    // for time assign pop up window, watch select project drop down
    // and set the project and skills as the selected one, so user can assign time to different skills for the peoject
    $scope.$watch("selectPro", function () {
      for (var i = 0; i < $scope.projects.length; i ++) {
        if ($scope.projects[i].project_name === $scope.selectPro) {
            $scope.timeAssignPro = $scope.projects[i]; 
        }
      }
    })

    // init func set the look of the page
    $scope.init = function () {
      Project.getAll()
        .then(function(all) {
          var temp = all.projects;
          var skills = [];

          // loop through the projects array received from server
          // create a unique skills array >> skills
          for (var i = 0; i < temp.length; i ++) {
            if (temp[i].skill1) {
              if (skills.indexOf(temp[i].skill1) === -1) {
                skills.push(temp[i].skill1);
              }
            }
            if (temp[i].skill2) {
              if (skills.indexOf(temp[i].skill2) === -1) {
                skills.push(temp[i].skill2);
              }
            }
            if (temp[i].skill3) {
              if (skills.indexOf(temp[i].skill3) === -1) {
                skills.push(temp[i].skill3);
              }
            }
          }
          $scope.projects = temp;
          $scope.skills = skills;

          // default the timeassign project as the first project for the user before user select a project in the time assign pop up window
          $scope.timeAssignPro = $scope.projects[0];

          // reset satrt and end so the page show properly.
          $scope.start = null;
          $scope.end = null;
        });
    };

    $scope.startClock = function () {
      $scope.start = new Date();
      $scope.end = null;
    };

    $scope.endClock = function () {
      $scope.end = new Date();
      $scope.actTime = (($scope.end - $scope.start)/(1000*60*60) + 3).toFixed(2);
      $scope.start = null;
    };

    // after completeProject send request to server complete, run init file to rerender the dashboard page with new data added
    $scope.completeProject = function (project) {
      Project.completeProject(project)
        .then(function(data){
          $scope.init();
        })
    };

   // after timeAssign send request to server complete, run init file to rerender the dashboard page with new data added
    $scope.timeAssign = function () {
      Project.timeAssign($scope.timeAssignPro)
        .then(function(data){
          $scope.init();
        })
    }

  };

})();