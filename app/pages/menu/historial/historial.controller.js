'use strict'

var _ = require('lodash');

angular.module('jotun')
  .controller('HistorialCtrl', function($scope, $state, $rootScope, b, h, g, $q, DTOptionsBuilder, DTColumnBuilder, $compile, $mdMedia, $mdDialog) {
    var historialFull = {};
    //BLOCK START :: Parqueadero tabla
    //Opciones de tabla

    $scope.fechaIni = '';
    $scope.fechaFin  =  '';

    $scope.$watch('fechaFin',function(value){
      loadWithDates(value);
    });

    $scope.$watch('fechaIni',function(value){
      loadWithDates(value);
    });


    function loadWithDates (value) {
      if( value && ($scope.fechaIni !== '' && $scope.fechaFin !== '')){
        

        var Ini = $scope.fechaIni.getFullYear()  + "-" +  ($scope.fechaIni.getMonth()+1)   + "-" +  $scope.fechaIni.getDate() ;
        var Fin = $scope.fechaFin.getFullYear()  + "-" +  ($scope.fechaFin.getMonth()+1)   + "-" +  $scope.fechaFin.getDate() ;
        var w = " fecha >= '" + Ini + "' and fecha <= '" + Fin + "' ";

        $scope.dtIH.changeData(function(){
          return queryHistorial(false,w);
        });
      }
    }

    var queryHistorial = function(top,where){
      $rootScope.load = true;
      var v = top ? 'top(150) ' : '';
      var order = ' order by id_ingreso desc';
      var where = where ? where + order  : ' 1=1 ' + order;
      return $q(function(resolve) {
        b.s({
          table: 'pre_historial',
          val: v +' *',
          where : where
        }).then(function(result) {
          historialFull = result;
          var newH = _.uniq(result, function(item){
            return item.id_ingreso;
          });
          $rootScope.load = false;
          resolve(newH);
        });
      });
    };

    $scope.dtOH = DTOptionsBuilder.fromFnPromise(function() {
        return queryHistorial(true);
      })
      .withOption('order', [[2, 'desc']])
      .withColumnFilter()
      .withOption('responsive', true)
      .withOption('createdRow', createdRow);
    /*$scope.dtOH = DTOptionsBuilder.newOptions()
      .withOption('ajax', {
        url: 'http://localhost:8080/api/q',
        type: 'POST'
      })
      .withDataProp('data')
      //.withOption('processing', true)
      //.withOption('serverSide', true)
      .withOption('bLength', false)
      .withPaginationType('full_numbers')
      .withOption('bInfo', false)
      .withColumnFilter()
      .withOption('responsive', true)
      .withOption('createdRow', createdRow);
*/

    $scope.modoCarga  = function(ev){
      h.confirm({
        t:'¿Estás seguro de activar el modo carga?',
        tc : 'El modo carga mostrará todos los registros existentes del historial en la base de datos y puede llegar tardar varios minutos'
      },ev, function(){
        $scope.dtIH.changeData(function(){
          return queryHistorial(false);
        });
      });

    }

    // Declaración de columnas
    var columnas = [{
      c: 'nTarjeta',
      t: 'N° tarjeta',
      o: [{
        op: 'bSortable',
        val: false
      }, {
        op: 'sWidth',
        val: '10%'
      }]
    }, {
      c: null,
      t: '',
      r: function(data) {
        return render(data, 1);
      },
      o: [{
        op: 'bSortable',
        val: false
      }, {
        op: 'sWidth',
        val: '0.5%'
      }]
    }, {
      c: null,
      t: 'Fecha',
      r: function(data) {
        return render(data, 20);
      }
    }, {
      c: 'horag',
      t: 'Hora ingreso/salida'
    }, {
      c: 'cedula',
      t: 'Cedula'
    }, {
      c: 'nombre',
      t: 'Visitante'
    }, {
      c: null,
      t: '¿Vechiculo?',
      r: function(data) {
        return render(data, 8);
      },
      o: [{
        op: 'sWidth',
        val: '6%'
      }]
    }, {
      c: null,
      t: '¿Dispositivo?',
      r: function(data) {
        return render(data, 9);
      },
      o: [{
        op: 'sWidth',
        val: '6%'
      }]
    }];

    $scope.dtCH = $scope.gColumns(columnas);
    //Columnas dinamicas
    function render(data, r) {
      //variable de retorno
      var re = '';
      //Renderiza segun numero de columna
      if (r == 1) {
        //Si ya salió
        if (data.hora_s)
          re = '<md-button class="md-icon-button" ng-click="show($event,11,' + data.id_ingreso + ')"> <i class="material-icons md">center_focus_weak</i> <md-tooltip>Salida</md-tooltip></md-button></i>';
        else //Si aun no ha salido
          re = '<md-button class="md-icon-button md-primary" ng-click="show($event,11,' + data.id_ingreso + ')">  <i class="material-icons md">filter_center_focus</i> <md-tooltip>Instalaciones</md-tooltip></md-button></i>';
      } else if (r == 8) {
        //Si ingresoó con Vechiculo
        if (data.placa)
          re = ' <md-button class="md-icon-button md-primary" ng-click="show($event,9,' + data.id_ingreso + ')" > <i class="material-icons md">check</i></md-button>';
        else //Si ingreso a pie
          re = ' <md-button class="md-icon-button" > <i class="material-icons md">close</i> </md-button>';
      } else if (r == 9) {
        //Si ingresoó con Vechiculo
        if (data.serial)
          re = ' <md-button class="md-icon-button md-primary" ng-click="show($event,10,' + data.id_ingreso + ')"> <i class="material-icons md">check</i> </md-button>';
        else //Si ingreso a pie
          re = ' <md-button class="md-icon-button "> <i class="material-icons md">close</i> </md-button>';
      } else if (r == 20) {
        re = moment(data.fecha).add(1, 'day').locale('es').format('ll');
      }
      return re;
    }
    // Instancia de la tabla
    $scope.dtIH = {};
    //BLOCK END
    //BLOCK START :: Opciones y funciones de renderización
    function createdRow(row, data, dataIndex) {
      $compile(angular.element(row).contents())($scope);
    }
    //BLOCK END
    //BLOCK START :: APERTURA DE DIALOG
    $scope.show = function(ev, v, k) {
      $scope.shit = '0';
      g.dialog(ev, v, k);
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };
    //BLOCK END
  });
