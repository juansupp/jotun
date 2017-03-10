'use strict';

angular.module('jotun')
  .controller('MenuCtrl', function ($scope,$rootScope, $state,$location,$timeout,
    $mdSidenav,$q, $mdUtil, $log,b,g ) {

   //Cerrar sesión
    $scope.closeSession = function () {
      g.dStor(['id_usuario','nombre']);
      $state.go('login');
    };

    function leRol(){
      return g.gStor('rol') == 1 ?  true : false;
    }

    $scope.menuHeads = [
      {
        sh : false,
        icon :  'subdirectory_arrow_right',
        title : 'Entrada',
        show : true,
        url : 'm.entrada'
      },
      {
        sh : false,
        icon :  'subdirectory_arrow_left',
        title : 'Salida',
        show : true,
        url : 'm.salida'
      },
      {
        sh : false,
        icon :  'history',
        title : 'Historial',
        show : true,
        url: 'm.historial'
      },
      {
        sh : false,
        icon :  'import_export',
        title : 'Exportación excel',
        show : true,
        url : 'm.excel'
      },
      {
        'sh' : false,
        'icon' : 'book',
        'title': 'Administración',
        show : leRol(),
        url : 'm.a.general'
      }
    ];


    ///MENU SIDEBAR
    $scope.SinMenu = function () {
      return false;
    };
    $scope.isActive = function(route) {
      return route === $location.path();
    };
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug('toggle ' + navID + ' is done');
              });
          },300);
      return debounceFn;
    }
    $scope.toggleLeft = buildToggler('left');


  }).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
   $scope.close = function () {
     $mdSidenav('left').close();
   };
 });
