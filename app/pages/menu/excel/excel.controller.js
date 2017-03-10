///importaciones
var fs = require("fs");
var json2xls = require('json2xls');
var path = require("path");
var homedir = require('homedir');



angular.module("jotun").controller("ExcelCtrl", function($rootScope, $scope, b, h) { //llamo   a  mi  servicio  b
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  $scope.Fini = "";
  $scope.Ffin = "";
  $scope.CtIngre = "";
  //Función  pública
  $scope.miexcel = function() {
    var w = '';
    var paso = false;
    if ($scope.CtIngre) {
      if ($scope.Fini === '') { // EXPORTACION SIN FECHAS
        paso = true;
        w = $scope.CtIngre;
      } else {
        if($scope.Fini !== '' && $scope.Ffin !== ''){
          console.log($scope.Fini.getDate());
          console.log($scope.Ffin.getDate());
          paso = true;
          var Ini = $scope.Fini.getFullYear()  + "-" +  ($scope.Fini.getMonth()+1)   + "-" +  $scope.Fini.getDate()  ;
          var Fin = $scope.Ffin.getFullYear()  + "-" +  ($scope.Ffin.getMonth()+1)   + "-" +  $scope.Ffin.getDate()  ;
          w = $scope.CtIngre + " and " + " fecha >= '" + Ini + "' and fecha <= '" + Fin + "' ";
        }else {
          h.notW('Verifica que las fechas sean correctas');
        }
      }

      if(paso){
        b.s({
          table: 'historial',
          val: '*',
          where: w
        }).then(function(rs) {
          if(rs){
            var date = new Date();
            var S =   date.getDate() +''+ date.getMonth() +''+date.getYear()+''+date.getHours()
            //Concatenación de la ruta
            var ruta = homedir() + "/Documents/Jotun/historial"+S+".xlsx";
            //Convierto la data (JSON) en EXCEL
            

            for (var i = 0; i < rs.length ; i++) {
              console.log(rs);
              if(rs[i].fecha){
                rs[i].fecha =  (moment(rs[i].fecha).add(1, 'day').locale('es').format('ll')).toString();
              }
                
            }

            var xls = json2xls(rs);
            //FILE SYSTEM lee el path y lo crea si no existe dentro de la crpeta asignada
            fs.writeFileSync(ruta, xls, 'binary');
            //CUANDO TODO ESTE BIEN
            h.notS("Guardado  con  exito  en la  ruta: "+ ruta);
          }else{
            h.notW('No se ha encontrado ningún dato con los fltros correspondientes');
          }
        });
      }
    }else {
      h.notW('Debes seleccionar un filtro');
    }
  }
});
