'use strict';

angular.module('erp2015App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('hospiPortal', {
        url: '/hospiPortal',
        templateUrl: 'app/hospitality/hospitality.html',
        controller: 'HospitalityCtrl'
      })
      .state('hospitality_receipt',{
        url:'/hospiPortal/receipt',
        templateUrl: 'app/hospitality/receipt.html',
        controller: 'HospitalityReceiptCtrl'
      })
      .state('hospitality_add',{
        url:'/hospiPortal/add',
        templateUrl: 'app/hospitality/hospitality_add.html',
        controller: 'HospitalityAddCtrl'
      });
  });
