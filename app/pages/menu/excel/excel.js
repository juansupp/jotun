'use strict';

angular.module('jotun')
  .config(function ($stateProvider) {
    $stateProvider
      .state('m.excel', {
        url: '/excel',
        templateUrl: 'pages/menu/excel/excel.html',
        controller: 'ExcelCtrl'
      });
  });
