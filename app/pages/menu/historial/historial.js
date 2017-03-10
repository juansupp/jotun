'use strict'

angular.module('jotun')
  .config(function($stateProvider) {
    $stateProvider
      .state('m.historial', {
        url: '/historial',
        templateUrl: 'pages/menu/historial/historial.html',
        controller: 'HistorialCtrl'
      });
  });
