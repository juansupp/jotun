'use strict'

angular.module('jotun')
  .config(function($stateProvider) {
    $stateProvider
      .state('m.a', {
        abstract: true,
        templateUrl: 'pages/menu/admin/a/a.html',
        controller: 'aCtrl'
      });
  });
