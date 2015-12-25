'use strict';

angular.module('erp2015App')
  .controller('HospitalityCtrl',function ($scope,$resource, $state, $http, Auth, User, HospitalityService) {
    var sponsors=$resource('/api/hospitality');
    $scope.all_sponsors = sponsors.query();

    console.log(sponsors.query());
    HospitalityService.getTeams()
        .then(function (result) {
          $scope.teams = result;
  
        });
    $scope.users = User.query();
    $scope.showbill = function(){
      console.log("showbill");
      $state.go('hospitality_receipt');
    };
    $scope.img_uri = function(logo){
      if(!logo)
        return "";
      var idx=logo.indexOf('pics');
      var path='http://localhost/'+logo.slice(idx);
      return path;
    }
  });
