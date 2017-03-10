angular.module('jotun')
  .service('n', function(b, h, g, $q) {

    function i(t, v) {
      var def = $q.defer();
      b.i({
        table: t,
        val: v
      }).then(function(result) {
        def.resolve(result);
      });
      return def.promise;
    }

    function q(t, v, w) {
      var def = $q.defer();
      b.s({
        table: t,
        val: v,
        where: w
      }).then(function(result) {
        def.resolve(result);
      });
      return def.promise;
    }

    function u(t, v, w) {
      var def = $q.defer();
      b.u({
        table: t,
        val: v,
        where: w
      }).then(function(result) {
        def.resolve(result);
      });
      return def.promise;
    }


    function e(t, v) {
      var def = $q.defer();
      b.eE({
        Procedure: t,
        val: v
      }).then(function(result) {
        def.resolve(result);
      });
      return def.promise;
    }


    var vehiculo = function(ob) {
      //View or table native
      var t = ob.view ? 'adminVehiculo' : 'vehiculo';
      ob.v = ob.v ? ob.v : '*';
      if (ob.case === 'i')
        return i(t, h.rQ(ob.v));
      else if (ob.case === 'u')
        return u(t, h.rE(ob.v), 'id_vehiculo = ' + ob.id);
      else if (ob.case === 's')
        return q(t, ob.v, ob.w);
    };

    var activo = function(ob) {
      //View or table native
      var
        t = ob.view ? 'adminDispositivos' : 'activo';
      t = ob.persona ? 'activosPerPersona' : t;
      t = ob.exec ? 'sp_Activos' : t;
      t = ob.detalle ? 'det_activo' : t;

      //Values por defecto son todos  = *
      ob.v = ob.v ? ob.v : '*';
      // LE ID DE ACTIVO Y DET_ACTIVO
      var cualId = ob.detalle ? 'id_det_activo'  :  'id_activo';
      // SWITCH
      if (ob.case === 'i')
        return $q(function(resolve) {
          i(t, h.rQ(ob.v)).then(function() {
            q(t, ' top(1) * ', ' 1=1 order by '+ cualId +' desc ').then(function(r) {
              resolve(r);
            });
          });
        });
      else if (ob.case === 'u')
        return u(t, h.rE(ob.v), 'id_activo = ' + ob.id);
      else if (ob.case === 's')
        return q(t, ob.v, ob.w);
      else if (ob.case === 'e') {
        return e(t, ob.v);
      }

    };




    var persona = function(ob) {
      //View or table native
      var t = ob.view ? 'persona' : 'persona';
      ob.v = ob.v ? ob.v : '*';
      t = ob.parcial ? 'sp_parcial' : t;
      if (ob.case === 'i') {
        return $q(function(resolve) {
          i(t, h.rQ(ob.v)).then(function() {
            q(t, ' top(1) * ', ' 1=1 order by id_persona desc ').then(function(r) {
              resolve(r);
            });
          });
        });
      } else if (ob.case === 'u')
        return u(t, ob.v , ob.w);
      else if (ob.case === 's')
        return q(t, ob.v, ob.w);
      else if (ob.case === 'e')
        return e(t, ob.v);
    };

    var usuario = function(ob) {
      //View or table native
      var t = ob.view ? 'usuairo' : 'usuario';
      ob.v = ob.v ? ob.v : '*';
      if (ob.case === 'i') {
        var def = $q.defer();
        b.i({
          table: t,
          val: "  '" + ob.v[0] + "', '" + ob.v[1] + "', dbo.enc('" + ob.v[2] + "'), '" + ob.v[3] + "', "+ ob.v[4] +"  "
        }).then(function(data) {
          def.resolve(data);
        });
        return def.promise;
      } else if (ob.case === 'u') {
        //return u(t, h.rE(ob.v), 'id_usuario = ' + ob.id);
        var def = $q.defer();
        b.u({
          table: 'usuario',
          val: " Nombre='" + ob.v[0] + "', nick='" + ob.v[1] + "', pass= dbo.enc('" + ob.v[2] + "'), rol='" + ob.v[3] + "'",
          where: 'id_usuario =' + ob.id
        }).then(function(data) {
          def.resolve(data);
        });
        return def.promise;
      } else if (ob.case === 's')
        return q(t, ob.v, ob.w);
    };

    var area = function(ob) {
      //View or table native
      var t = ob.view ? 'area' : 'area';
      ob.v = ob.v ? ob.v : '*';
      if (ob.case === 'i') {
        return $q(function(resolve) {
          i(t, h.rQ(ob.v)).then(function() {
            q(t, ' top(1) * ', ' 1=1 order by id_area desc ').then(function(r) {
              resolve(r);
            });
          });
        });
      } else if (ob.case === 'u')
        return u(t, h.rE(ob.v), 'id_area = ' + ob.id);
      else if (ob.case === 's')
        return q(t, ob.v, ob.w);
      else if (ob.case === 'e')
        return e(t, ob.v);
    };

    var tarjeta = function(ob) {
      //View or table native
      var t = 'nta';
      ob.v = ob.v ? ob.v : '*';
      if (ob.case === 'i') {
        return $q(function(resolve) {
          i(t, h.rQ(ob.v)).then(function() {
            q(t, ' top(1) * ', ' 1=1 order by id_nta desc ').then(function(r) {
              resolve(r);
            });
          });
        });
      } else if (ob.case === 'u')
        return u(t, h.rE(ob.v), 'id_nta = ' + ob.id);
      else if (ob.case === 's')
        return q(t, ob.v, ob.w);
      else if (ob.case === 'e')
        return e(t, ob.v);
    };

    var parqueadero = function(ob) {
      //View or table native
      var t = ob.view ? 'parqueadero' : 'parqueadero';
      ob.v = ob.v ? ob.v : '*';
      if (ob.case === 'i') {
        return $q(function(resolve) {
          i(t, h.rQ(ob.v)).then(function() {
            q(t, ' top(1) * ', ' 1=1 order by id_parq desc ').then(function(r) {
              resolve(r);
            });
          });
        });
      } else if (ob.case === 'u')
        return u(t, h.rE(ob.v), 'id_parq = ' + ob.id);
      else if (ob.case === 's')
        return q(t, ob.v, ob.w);
      else if (ob.case === 'e')
        return e(t, ob.v);
    };


    var entrada = function(ob) {
      var t = 'sp_ingreso';
      console.log(ob.v);
      if (ob.case === 'e') {
        return $q(function(resolve) {
          e(t, h.rQ(ob.v)).then(function() {
            q('ingreso', ' top(1) * ', ' 1=1 order by id_ingreso desc ').then(function(r) {
              resolve(r[0].id_ingreso);
            });
          });
        });
      }
    };

    var ACTIVOS = [];

    return {
      vehiculo: vehiculo,
      activo: activo,
      usuario: usuario,
      tarjeta: tarjeta,
      area: area,
      parqueadero: parqueadero,
      persona: persona,
      entrada: entrada,
      ACTIVOS : ACTIVOS
    };
  });
