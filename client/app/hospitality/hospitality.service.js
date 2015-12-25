'use strict';

angular.module('erp2015App')
  .service('HospitalityService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getTeams: function() {
        return $http.get('/api/teams').then(function (response) {
          return response.data;
        });
      }
  	};
  });