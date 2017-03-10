'use strict'

angular.module('jotun')
  .controller('DispositivoCtrl', function($scope, $rootScope,g) {
    //BLOCK START :: Parqueadero tabla
      //Opciones de tabla
      $scope.dtOD = $scope.gTable('activo',true);
      // Declaración de columnas
      var columnas = [
        {c:'tipo',t:'Dispositivo'},
        {c:'marca',t:'Marca'},
        {c:'serial',t:'Serial'},
        {
          c:null,
          t:'',
          o: [{op:'sWidth',val:'5%'}],
          r : function(data){
            return '<md-button  class="md-icon-button md-primary little" ng-click=actualizarDispositivo($event,"'+data.id_activo+'") aria-label="More"><i class="material-icons">mode_edit</i></md-button>';
          }
        }
      ];
      $scope.dtCD = $scope.gColumns(columnas);
      //Columnas dinamicas
      $scope.$on('upDis', function(event, id) {
        g.dialog(event,4,  id).then(function(){
          reload();
        })
      });
      // Instancia de la tabla
      $scope.dtID = {};
    //BLOCK END
    /////////////////////////////////////////////////////////////////////////////////////////////()
    //recargar  los  dispositivos hay  mismo

    function reload(){
      $scope.dtID.reloadData(function(json){
        console.log(json);
      },false);

    }
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////
