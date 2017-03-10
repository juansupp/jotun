'use strict'

angular.module('jotun')
  .controller('UsuarioCtrl', function($scope, $rootScope, DTColumnBuilder, g) {
    //BLOCK START :: Parqueadero tabla
    //Opciones de tabla
    $scope.dtOU = $scope.gTable('usuario', true);
    // Declaración de columnas
    var columnas = [{
        c: 'nombre',
        t: 'Nombre'
      }, {
        c: 'nick',
        t: 'Usuario'
      }, {
        c: 'rol',
        t: 'Rol'
      }, {
        c: null,
        t: '',
        o: [{
          op: 'sWidth',
          val: '5%'
        }],
        r: function(data) {
          return '<md-button class="md-icon-button md-primary little" ng-click=actualizarUsuario($event,"' + data.id_usuario + '")  aria-label="More"><i class="material-icons">mode_edit</i></md-button>';
        }
      }

    ];

    $scope.$on('upUser', function(event, id) {

      g.dialog(event, 6, id).then(function() {
        reload();
      })
    });

    $scope.dtCU = $scope.gColumns(columnas);

    $scope.insertar = function(event) {
        //publica  funcio//event

        g.dialog(event, 5, 0).then(function() {
          reload();
        })
      }
      //Columnas dinamicas

    // Instancia de la tabla
    $scope.dtIU = {};
    //BLOCK END
    //funcion pubila
    function reload() {
      $scope.dtIU.reloadData(function(json) {
        console.log(json);
      }, false);

    }

  });
