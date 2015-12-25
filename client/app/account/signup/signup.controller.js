'use strict';

angular.module('erp2015App')
  .controller('SignupCtrl', function ($scope, Auth, $state, $location, $window) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          secondName: $scope.user.secondName,
          email: $scope.user.email,
          password: $scope.user.password,
          city: $scope.user.city,
          rollNumber: $scope.user.rollNumber,
          phoneNumber: $scope.user.phoneNumber,
          cgpa: $scope.user.cgpa
        })
        .then( function() {
          // Account created, redirect to dashboard
          $state.go('eventsPortalDashboard');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
