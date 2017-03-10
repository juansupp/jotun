'use strict'

angular.module('jotun')
  .config(function($stateProvider) {

    $stateProvider
      .state('m.a.usuario', {
        url: '/usuario',
        views: {
          'usuario': {
            templateUrl: 'pages/menu/admin/usuario/usuario.html',
            controller: 'UsuarioCtrl'

          }

        },
        data: {
          selectedTab: 1
        }

      });

  });
