'use strict';

angular.module('jotun')
  .controller('LoginCtrl', function($scope, $state, $rootScope, b, h, g, $mdToast) {
    $scope.user = {};

    $scope.log = function() {
      $rootScope.load = true;
      b.s({
        table: 'usuario',
        val: '*',
        where: "nick = '" + h.d($scope.user.nick) + "' and dbo.desenc(pass) = '" + h.d($scope.user.pass) + "'"
      }).then(function(res) {
        $rootScope.load = false;
        if (res[0]) {
          g.sStor(res[0]);
          $state.go('m.entrada');
        } else
          h.notW('Verifica las credenciales.');
      });
    };

  });
