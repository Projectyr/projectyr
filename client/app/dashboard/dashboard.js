(function(){
  angular.module('projectyr.dashboard', [])
  .controller('DashboardController', DashboardController);

  function DashboardController ($scope, Project, Auth, $location) {
    $scope.start = null;
    $scope.end = null;
    $scope.actTime = 0;
    $scope.projects = [{project_name:"Sudokool", est_time: 100, act_time:50, skill1:"Javascript", skill2: "CSS", skill3: "other"}, {project_name: "Sudokool-Fangting", est_time: 100, act_time:50, skill1: "CSS", skill2: "HTML", skill3: "other"}];
    $scope.skills = [{skills_name: "Javascript", act_time: 100}, {skills_name: "CSS", act_time: 20}, {skills_name: "HTML", act_time: 20}, {skills_name: "RUBY", act_time: 20}, {skills_name: "Other", act_time: 20}];
    $scope.timeAssignPro = $scope.projects[0];

    $scope.$watch(Auth.isAuth, function(authed){
        if (authed) {
          $location.path('/dashboard');
        } else {
          $location.path('/signin')
        } 
      }, true);

    $scope.$watch("selectPro", function () {
      for (var i = 0; i < $scope.projects.length; i ++) {
        if ($scope.projects[i].project_name === $scope.selectPro) {
            $scope.timeAssignPro = $scope.projects[i]; 
            console.log($scope.timeAssignPro);
        }
      }
    })

    $scope.init = function () {
      Project.getAll()
        .then(function(all) {
          //$scope.skills = all.skills// [] od obj, has skill name/time.
          var temp = all.projects;
          var skills = [];
          for (var i = 0; i < temp.length; i ++) {
            if (temp[i].skill1) {
              temp[i][temp[i].skill1] = 1;//temp.time1
              if (skills.indexOf(temp[i].skill1) === -1) {
                skills.push(temp[i].skill1);
              }
            }
            if (temp[i].skill2) {
              temp[i][temp[i].skill2] = 1;//temp.time1
              if (skills.indexOf(temp[i].skill2) === -1) {
                skills.push(temp[i].skill2);
              }
            }
            if (temp[i].skill3) {
              temp[i][temp[i].skill3] = 1;//temp.time1
              if (skills.indexOf(temp[i].skill3) === -1) {
                skills.push(temp[i].skill3);
              }
            }
          }
          $scope.projects = temp;
          $scope.skills = skills;
        });
    };

    $scope.startClock = function () {
      $scope.start = new Date();
      $scope.end = null;
    };

    $scope.endClock = function () {
      $scope.end = new Date();
      $scope.actTime = (($scope.end - $scope.start)/(1000*60*60)).toFixed(5);
      $scope.start = null;
    };

    $scope.completeProject = function (project) {
      Project.completeProject(project)
        .then(function(data){
          $scope.init();
        })
    };

    $scope.timeAssign = function () {
      console.log($scope.timeAssignPro);
      console.log($scope.skillRem);
      Project.timeAssign($scope.timeAssignPro)
        .then(function(){
          $scope.init();
        })
    }

  };

})();