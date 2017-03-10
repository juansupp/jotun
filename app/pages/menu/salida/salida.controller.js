'use strict'

angular.module('jotun')
  .controller('SalidaCtrl', function($scope, $q, $rootScope, b, h) {
    //Lista
    $scope.nta = {};
    $scope.sf = {};
    $scope.ob = '';

    function ntaLoad() {
      $scope.sf = {};
      //Variable de defer
      //Busca las tarjetas según el filtro
      return b.s({
        table: 'nta',
        val: '*',
        where: 'ocupada = 1'
      }).then(function(result) {
        $scope.nta = result;
        
      });
    }

    $scope.qNta = function(query) {
      return query ? $scope.nta.filter(fNta(query)) : $scope.nta;
    };

    function fNta(query) {
      return function filterFn(nta) {
        return (nta.nTarjeta.indexOf(query) === 0);
      };
    }

    //load
    ntaLoad();

    $scope.valiexiste = function() {
      var n = h.ngm($scope.sf.numero_tarjeta);

      var ob = $scope.ob;

      b.s({                                                   //un  select de la bd
        table: 'nta', //--Obligatorios
        val: '*', //--Obligatorio
        where: "ocupada = 1 and nTarjeta =  '" + n + "'"
      }).then(function(data) {                                //me  devuelve

        if (data[0]) {
          var id = data[0].id_nta;
          b.eE({
            Procedure: 'sp_salida',                         //del  procedimiento almacenado se_salida
            val: h.rQ([id,ob])               //campos  requeridos
          }).then(function(bool) {
            h.notS("Salida  registrada   satisfactoriamente");  //mensaje   de  salida
          });
        } else {
          h.notE('El  número  de  trajeta  ingresado  no  es valido');                              //mensaje  de error
        }
      });
    }
  });
