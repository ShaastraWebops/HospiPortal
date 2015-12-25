'use strict';

angular.module('erp2015App')
  .factory('Excel',function($window){
        var uri='data:application/vnd.ms-excel;base64,',
            template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
            format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
        return {
            tableToExcel:function(tableId,worksheetName){
                var table=$(tableId),
                    ctx={worksheet:worksheetName,table:table.html()},
                    href=uri+base64(format(template,ctx));
                return href;
            }
        };
    })
  .controller('RegistrationsCtrl', function ($scope, EventsPortalService, $state, $http, $mdDialog, Auth, $stateParams, Excel, $timeout) {
    $scope.showButton= false;

    $scope.eventDetails = [];
    $http.get('/api/events/' + $stateParams.eventId)
    	.then(function (response) {
    		$scope.eventDetails = response.data;
    	});

    $http.get('/api/registrations/event/' + $stateParams.eventId)
      .then(function (data) {
        var maxTeamLength = 0;
        var numRegistartions = data.data.length;
        for(var i=0; i<numRegistartions; i++) {
          var numTeamMembers = data.data[i].team.teamMembers.length;
          if (maxTeamLength < numTeamMembers) {
            maxTeamLength = numTeamMembers;
          }
        }
        $scope.allRegistrations = data.data;
        console.log(data.data);
      });
    $scope.eventsShow = false;

    // $scope.eventListEditModal = function (eventList) {
    //   $mdDialog.show({
    //     controller: eventListEditModalCtrl,
    //     templateUrl: '/app/eventsPortal/eventList/eventListEditModal.tmpl.html',
    //     locals: {
    //       eventListPassed: eventList
    //     }
    //   })
    //   .then(function (response) {
    //     // console.log(response);
    //   }, function () {
    //     console.log('Cancel editing deal');
    //   });
    // };      

    function eventListEditModalCtrl($scope, $mdDialog, eventListPassed) {   
      // console.log(eventListPassed);
      $scope.editEventList = eventListPassed;
      
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.save = function () {
        // do the saving part here

        EventsPortalService.editEventList({
          _id: $scope.editEventList._id,
          title: $scope.editEventList.title,
          info: $scope.editEventList.info
        })
        .then(function (data) {
          $state.go('eventList');
        });

        $mdDialog.hide('Save edited deal');
      };      
    }

    $scope.getEvents = function (eventList) {
      EventsPortalService.getEvents({
        _id: eventList._id
      })
      .then(function (data) {
        $scope.events = data;
      });
      //$scope.events = eventList.events;
      // console.log(eventList);
      $scope.eventsShow = true;
    };      

    $scope.gotoEvent = function (eventID) {
      // console.log(eventID);
      $state.go('event', { 'id': eventID });
    };

    $scope.editEventListPhoto = function (index) {
      $mdDialog.show({
        controller: photoEditController,
        templateUrl: '/app/eventsPortal/eventList/dialog3.tmpl.html',
        parent: angular.element(document.body),
        resolve: {
          eventList: function () {
            return $scope.allRegistrations[index];
          },
          EventsPortalService: function () {
            return EventsPortalService;
          }
        }
      });
    };

    $scope.exportToExcel=function(tableId){ // ex: '#my-table'
            $scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
            $timeout(function() {
            var link = document.createElement('a');
            link.download = $scope.eventDetails.name + "_registrations.xlsx";
            link.href = $scope.exportHref;
            link.click();
            }, 100);
        };

  function photoEditController($scope, $mdDialog, eventList, EventsPortalService, $mdToast, Auth, $document, $upload) {
    $scope.hasRoleCore = Auth.hasRoleCore;
    $scope.eventList = eventList;
    console.log(eventList);

    $scope.myImage2 = '';
    $scope.myCroppedImage2 = '';

    var imageid = '';
    var imagename = '';
    var uploadfile = '';
    
    var handleFileSelect2 = function (evt) {
      var myfile = evt.currentTarget.files[0];
      // console.log(evt.currentTarget.files);
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.myImage2 = evt.target.result;
          // console.log($scope.myImage2);
        });
        uploadfile = myfile;
      };
      reader.readAsDataURL(myfile);
    };
    setTimeout(function () {angular.element(document.querySelector("#imgFile")).on('change', handleFileSelect2);}, 2000);

    var dataURItoBlob = function (dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };
    
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.updateEventList = function (form) {
      $scope.submitted = true;
      if(form.$valid) {
        $upload.upload({
          url: 'api/uploads/',
          file: dataURItoBlob($scope.myImage2)
        })
        .success(function (data, status, headers, config) {
          imageid = data.fileId;
          imagename = uploadfile.name;
          EventsPortalService.editEventList({
            _id: eventList._id,
            imageid: imageid,
            imagename: imagename
          }).then(function (data) {
            $mdToast.show($mdToast.simple().content('Picture updated successfully!').hideDelay(5000));
          });
          $mdDialog.cancel();
        });
      }
    };
  }

  // showing editDeal, createUpdate, editUpdate button only to permitted users
  Auth.isLoggedInAsync(function (loggedIn) {
    if(Auth.getCurrentUser().role === 'admin' || Auth.getCurrentUser().role === 'core' || Auth.getCurrentUser().role === 'superCoord') {
      $scope.showButton = true;                    
    }
  });

});
