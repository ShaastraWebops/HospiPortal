'use strict';

angular.module('erp2015App')
  .service('EventsPortalService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
    	createEventList: function (data) {
        return $http.post('/api/eventLists', data).then(function (response) {
        		return response.data;
      	});
    	},
      getEventList: function (eventListId) {
        return $http.get('/api/eventLists/' + eventListId).then(function (response) {
          return response.data;
        });
      },
		  editEventList: function (data) {
			  return $http.put('/api/eventLists/' + data._id, data).then(function (response) {
				  return response.data;
			  });
		  },
      getAllEventLists: function () {
        return $http.get('/api/eventLists').then(function (response) {
          return response.data;
        });
      },
      getCoords: function () {
        return $http.get('/api/users/getCoords').then(function (response) {
          return response.data;
        });
      },
      myEvents: function () {
        return $http.get('/api/events/myEvents').then(function (response) {
          return response;
        });
      },
      createEvent: function (data) {
        return $http.post('/api/events', data).then(function (response) {
            return response.data;
        });
      },
      updateEvent: function (data, id) {
        return $http.patch('/api/events/' + id, data).then(function (response) {
            return response.data;
        });
      },
      toggleEvent: function (data, id) {
        return $http.patch('/api/events/toggleVisiblity/' + id, data).then(function (response) {
            return response.data;
        });
      },
      getEvents: function (data) {
        return $http.get('/api/events/getMultiple/' + data._id).then(function (response) {
            return response.data;
        });
      },
      editEvent: function (data) {
        return $http.put('/api/events/' + data._id, data).then(function (response) {
          return response.data;
        });
      },
      getTabs: function (data) {
        return $http.get('/api/eventTabs/' + data._id).then(function (response) {
          return response.data;
        });
      },
      getEvent: function (eventId) {
        return $http.get('/api/events/' + eventId).then(function (response) {
          return response.data;
        });
      },
      deleteEventTab: function (tabId) {
        return $http.delete("/api/eventTabs/" + tabId);
      },
      createEventTab: function (data) {
        return $http.post("/api/eventTabs", data).then(function (response) {
          return response.data;
        });
      },
      getEventTabs: function (eventId) {
        return $http.get('/api/eventTabs/' + eventId).then(function (response) {
          return response.data;
        });
      },
      getAllRegistrations: function (eventId) {
        return $http.get('/api/registrations/event/' + eventId).then(function (response) {
          return response.data;
        });
      },
      updateTab: function (tabId, updatedTab) {
        return $http.put("/api/eventTabs/" + tabId, updatedTab).then(function (response) {
          return response;
        });
      }
  	};
  });
