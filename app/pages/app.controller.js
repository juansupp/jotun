'use strict';

angular.module('jotun').controller('AppCtrl', function($scope, $state, $rootScope, b, h, g, $mdToast, $q, DTOptionsBuilder, DTColumnBuilder, $compile) {
  //Loeading por defecto invisible
  $rootScope.load = false;

  //Consulta de la tabla
  $scope.promesa = function(info) {
    //Se inicializa el loader
    $rootScope.load = true;
    //En caso que el v esté vacio por defecto se toma *
    if (!info.v) info.v = '*'
      //En caso que el w esté vacio por defecto se establecera 1=1
    if (!info.w) info.w = '1=1'
      //Promesa
    return $q(function(resolve) {
      //Select segun object info
      b.s({
        table: info.t,
        val: info.v,
        where: info.w
      }).then(function(response) {
        //Se para el loader
        $rootScope.load = false;
        //Return de la data
        resolve(response);
      });
    });
  };

  $scope.gTable = function(tab, filter) {
    return DTOptionsBuilder.fromFnPromise(function() {
        return $scope.promesa({
          t: tab
        });
      })
      .withOption('bLengthChange', false)
      .withOption('bInfo', false)
      .withColumnFilter(filter)
      .withOption('responsive', true)
      .withOption('createdRow', createdRow);
  };

  //Declaración de columnas globales
  $scope.gColumns = function(ob) {
    //Array de cada columna
    var arr = [];
    //For para recorrer las columnas declaradas en ob {c = Nombre de la columnas, t = Titulo}
    for (var i = 0; i < ob.length; i++) {
      //Var renderizar la columna con columna y titulo
      var col = DTColumnBuilder.newColumn(ob[i].c).withTitle(ob[i].t);
      //En caso que sea una columna con renderización personalizada
      if (ob[i].r) {
        col.renderWith(ob[i].r);
      }
      //En caso que sea una columna con opciones especiales
      if (ob[i].o) {
        //For para recorrer cada opcion que haya en el Array
        for (var x = 0; x < ob[i].o.length; x++) {
          //Var option para para Object {op = Nombre de la opcion, val = valor de la opcion}  que esté en el array
          var option = ob[i].o[x];
          //Se agregan las opciones a la variable col
          col.withOption(option.op, option.val);
        }
      }
      //En caso que no se permita hacer el sort
      if(!ob.sort)
        col.notSortable();

      //Se agrega cada una de las columnas
      arr.push(col);
    }
    //Se retorna el array una vez lleno
    return arr;
  }

  $scope.bum = function() {
    $scope.$broadcast('bumer', 'someshit');
  };


  //Llama a funcion de actualizar dispostivo en el mismo controlador
  $scope.actualizarDispositivo = function(event,id) {
    $scope.$broadcast('upDis',id);
  };

  $scope.actualizarUsuario = function(event,id) {
    $scope.$broadcast('upUser',id);
  };




  //BLOCK START :: Opciones y funciones de renderización
  function createdRow(row, data, dataIndex) {
    $compile(angular.element(row).contents())($scope);
  }
  //BLOCK END


});
