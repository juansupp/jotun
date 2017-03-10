'use strict'

angular.module('jotun')
  .controller('aCtrl', function($scope, $rootScope, $q, b, h, g, DTOptionsBuilder, DTColumnBuilder, $compile) {

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $scope.currentTab = toState.data.selectedTab;
    });

    $scope.validando=function(){
      return g.gStor('rol') == 1 ? true : false ;
    }
  });
