'use strict'

angular.module('jotun')
  .controller('DialogCtrl', function($scope, $rootScope, $mdDialog, g, h, b, n, v, k) {
    // BLOCK START :: Definición de variables de controlador
    $scope.titulo = '';
    $scope.v = v;
    $scope.vehiculo = {};
    $scope.activo = {};
    $scope.usuario = {};
    $scope.btn = '';
    $scope.jt = {};
    var activos = [];
    //BLOCK END

    //BLOCK START :: VALIDACION DE TIPO DE DIALOGO
    if (v == 1) { //Ingresar vehiculo
      //Se le da un titulo al dialog
      $scope.titulo = 'Nuevo vehiculo';
      //Se le da un texto al boton
      $scope.btn = 'Registrar';

    } else if (v == 2) { //Ingresar dispositivo
      //Se le da un titulo al dialog
      $scope.titulo = 'Nuevo dispositivo';
      //Se le da un texto al boton
      $scope.btn = 'Registrar';
      //Reinicia el array donde se guardan los activos
      var activos = [];
    } //Datos de los dispositivos ingresados
    else if (v == 4) { //actualizar dispositivo
      //Se le da un titulo al dialog
      $scope.titulo = 'Actualizar  Dispositivo';
      b.s({
        table: 'activo',
        val: '*',
        where: 'id_activo =' + k
      }).then(function(data) {
        $scope.activo = data[0];
      });
      //Se le da un texto al boton
      $scope.btn = 'Actualizar';
      $scope.pass1 = 'Nueva contraseña';
    } //Registrar  Usuarios
    else if (v == 5) {
      $scope.titulo = " Registrar  usuario"
      $scope.btn = "Registrar";
      $scope.pass1 = "Contraseña";
    } //actualizar  usuarios
    else if (v == 6) {
      $scope.titulo = "Actualizar usuario";
      $scope.btn = "Actualizar";
      $scope.pass1 = "Nueva contraseña";
      b.s({
        table: 'usuario',
        val: 'nombre,nick,rol,dbo.desenc(pass) pass',
        where: 'id_usuario =' + k
      }).then(function(data) {
        console.log(data);
        $scope.usuario = data[0];
      });

    } else if (v == 7) { //
      $scope.titulo = "Tarjeta n°";
      $scope.btn = "Ok";
      HorasP('id_nta=' + k + ' and hora_s is null');

    } else if (v == 8) { //
      $scope.titulo = "Información general  de  parqueadero";
      $scope.btn = "Aceptar";
      HorasP('id_parq=' + k + ' and hora_s is null');
    }
    //consulta  tabla  Vehiculos
    else if (v == 9) {
      $scope.titulo = "Detalle  vehículo";
      $scope.btn = "Aceptar";
      //sellecciono la  tabla  vehículo
      b.s({
        table: 'v_detvehiculo',
        val: '*',
        where: 'id_ingreso =' + k
      }).then(function(data) {
        console.log(data);
        $scope.jt = data[0];
      });

    } else if (v == 10) {
      $scope.titulo = "Detalle  dispositivo";
      $scope.btn = "Aceptar";
      //sellecciono la  tabla  vehículo
      b.s({
        table: 'v_detdispositivo',
        val: '*',
        where: 'id_ingreso =' + k
      }).then(function(data) {
        console.log(data);
        $scope.jt = data[0];
      });

    } else if (v == 11) {
      $scope.titulo = "Detalle  ingreso";
      $scope.btn = "Aceptar";


      //sellecciono la  tabla  vehículo
      b.s({
        table: 'ingreso',
        val: ' mv,pv,observacion,observacion_s',
        where: 'id_ingreso =' + k
      }).then(function(data) {
        console.log(data);
        $scope.jt = data[0];
      });
    }
    //BLOCK END
    //BLOCK START :: CRUD DEL ACTIVO
    $scope.Activo = function() {
      if (v === 2) {
        //Insertar
        newActivo();
      } else if (v === 4) {
        //Actualizar
        updateActivo();
      }
    };

    //Inserta uin nuevo activo
    function newActivo() {
      var activo = $scope.activo;
      //
      if (k !== '0') {
        n.activo({
          case: 'i',
          v: h.rQ([activo.serial, activo.marca, activo.tipo,k])
        }).then(function(r) {
          $mdDialog.hide();
        });
      }
    };
    //Function para hacer un update al activo
    function updateActivo() {
      n.activo({
        case: 'u',
        v: {
          serial: $scope.activo.serial,
          marca: $scope.activo.marca,
          tipo: $scope.activo.tipo
        },
        id: k
      }).then(function() {
        $mdDialog.hide();
      });
    }
    //BLOCK END
    /////////////////////////////////////////////////////////////////////////////
    //REGISTRO DE HORAS  Y  PERSONAS
    /// FIXME  :: esta funcion que hace
    function HorasP(w) {
      var t = v === 7 ? 'admintarjeta' : 'adminParq';
      b.s({
        table: t,
        val: '*',
        where: w
      }).then(function(data) {
        $scope.info = data[0];
        var horas = [];
        var minutos = [];
        //console.log($scope.info.hora_e);
        // 0 == hora actual
        // 1 == Hora de entrada
        horas[0] = new Date().getHours();
        horas[1] = parseInt(($scope.info.hora_e).substring(0, 2));
        // 0 == minuto actual
        // 1 == minuto de entrada
        minutos[0] = new Date().getMinutes();
        minutos[1] = parseInt(($scope.info.hora_e).substring(3, 5));
        //Hora resttante
        var restante = (parseInt(horas[0]) - parseInt(horas[1])) + ":" + (parseInt(minutos[0]) - parseInt(minutos[1]));

        $scope.info['restante'] = "0" + restante.replace(/-/g, "");
      });
    }
    /////////////////////////////////////////////////////////////////////////////
    //LLamo  a  usuario  ingresar o actualizar
    $scope.usuarioF = function() { //Insertar
        if (v === 5) {
          b.s({
            table: 'usuario', //--Obligatorios
            val: '*',
            where: "nick='" + $scope.usuario.nick + "'"
          }).then(function(data) {
            if (data[0])
              h.notW('Nombre de usuario ya insertado, intenta con otro');
            else
              newUser();
          });
        } else if (v === 6) { //Actualizar
          //Actualizar
          updateUser();
        }
      }
      ////////////////////////////////////////////////////////////////////////////////////////
    function newUser() { //asi  es  funcion privada
      $rootScope.load = true;
      var usuario = $scope.usuario;
      if (ValiPass()) {
        n.usuario({
          case: 'i',
          v: [usuario.nombre, usuario.nick, usuario.pass, usuario.rol,'null']
        }).then(function() {
          $rootScope.load = false;
          h.notS("Registrado satisfactoriamente");
          $mdDialog.hide();
        });
      }
      $rootScope.load = false;
    }
    //Actualizar  usuario:
    function updateUser() {
      if (ValiPass()) { //valido  contraseña
        var usuario = $scope.usuario;
        n.usuario({
          case: 'u',
          id: k,
          v: [usuario.nombre, usuario.nick, usuario.pass, usuario.rol]
        }).then(function() {
          $rootScope.load = false;
          h.notS("Actualizado  satisfactoriamente") //Mensaje  de  salida
          $mdDialog.hide();
        });
      }
      $rootScope.load = false;
    }
    //validacion  nueva  contraseña
    function ValiPass() {
      var u = $scope.usuario;
      if (u.contrasema === u.contrasema1) {
        u.pass = u.contrasema;
        return true;
      } else {
        h.notW("Por  favor  verifique  las  contraseñas, puesto que  no  coinciden");
        return false;
      }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////








    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    //BLOCK START :: CRUD DE Vehiculo
    $scope.Vehiculo = function() {};
    //BLOCK END
    $scope.UpdateVeh = function() {
      b.u({
        table: 'vehiculo',
        val: h.rE({
          placa: vehiculo.placa,
          color: vehiculo.color,
          marca: vehiculo.marca
        }),
        where: ' id_vehiculo' + k
      }).then(function(data) {
        $mdDialog.hide();
      });
    };
    $scope.newVehiculo = function() {
      var ve = $scope.vehiculo;
      if (k !== '0') {
        n.vehiculo({
          case: 'i',
          v: [ve.placa, ve.color, ve.marca, k]
        }).then(function() {
          $mdDialog.hide();
        });
      }
    };

    $scope.cancel = function() {
      $mdDialog.hide();
    };
  });
