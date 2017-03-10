'use strict';

angular.module('jotun')
  .config(function ($stateProvider) {
    $stateProvider
      .state('m', {
        abstract : true,
        templateUrl: 'pages/menu/m/menu.html',
        controller: 'MenuCtrl'
      });
  });
