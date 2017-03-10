'use strict'

angular.module('jotun')
  .controller('GeneralCtrl',
    function($scope, $rootScope, b, h, g, $q) {

      //Llena object para la lista de parqueaderos
      $scope.promesa({
        t: 'parqueadero'
      }).then(function(result) {
        $scope.parq = result;
      });

      //Llena object para la lista tarjeta
      $scope.promesa({
        t: 'nta'
      }).then(function(result) {
        $scope.nta = result;
      });

      $scope.AbrInfo=function(caso,id){
          g.dialog(event,caso,id);

      }

    });
