'use strict'

angular.module('jotun')
  .config(function($stateProvider) {
    $stateProvider
      .state('m.salida', {
        url: '/salida',
        templateUrl: 'pages/menu/salida/salida.html',
        controller: 'SalidaCtrl'
      });
  });
