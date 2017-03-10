'use strict';

angular.module('jotun', [
  'ngMaterial',
  'ui.router',
  'ngAnimate',
  'ngMessages',
  'datatables',
  'datatables.columnfilter',

])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider,$mdThemingProvider) {
  $urlRouterProvider.otherwise('/');
  //$locationProvider.html5Mode(true);
  $mdThemingProvider.theme('default').primaryPalette('light-blue').accentPalette('blue-grey');

})/*.run(function(amMoment){
  amMoment.changeLocale('es');
});*/
.run(function(DTDefaultOptions) {
    DTDefaultOptions.setLanguageSource('http://cdn.datatables.net/plug-ins/1.10.11/i18n/Spanish.json');
});
