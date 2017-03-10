'use strict'

angular.module('jotun')
  .config(function($stateProvider) {
    $stateProvider
      .state('m.a.dispositivo', {
        url :'/dispositivo',
        data : {
          selectedTab : 3
        },
        views : {
          'dispositivo' : {
            templateUrl : 'pages/menu/admin/dispositivo/dispositivo.html',
            controller : 'DispositivoCtrl'

          }
        }
      });
  });
