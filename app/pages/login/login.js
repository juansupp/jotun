'use strict';

angular.module('jotun')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'pages/login/login.html',
        controller: 'LoginCtrl'
      });
  });
