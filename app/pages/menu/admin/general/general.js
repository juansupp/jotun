'use strict'

angular.module('jotun')
  .config(function($stateProvider) {
    $stateProvider
      .state('m.a.general', {
        url: '/general',
        data: {
          selectedTab: 0
        },
        views: {
          'general': {
            templateUrl: 'pages/menu/admin/general/general.html',
            controller: 'GeneralCtrl'
          }
        }
      });
  });
