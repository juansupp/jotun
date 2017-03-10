(function() {
    'use strict';

    angular.module('jotun')
        .config(entradaConf);


    function entradaConf($stateProvider) {
        $stateProvider
            .state('m.entrada', {
                url: '/entrada',
                templateUrl: 'pages/menu/entrada/entrada.html',
                controller: 'EntradaCtrl as vm',
            });
    }

})();
