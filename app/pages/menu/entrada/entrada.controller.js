(function() {

    'use strict';

    angular.module('jotun')
        .controller('EntradaCtrl', EntradaCtrl);

    EntradaCtrl.$inject = ['$scope', '$rootScope', '$state', '$location', '$timeout',
        '$mdSidenav', '$q', '$mdUtil', '$log', 'b', 'g', 'n', 'h', 'combo'
    ];

    function EntradaCtrl($scope, $rootScope, $state, $location, $timeout,
        $mdSidenav, $q, $mdUtil, $log, b, g, n, h, combo) {
        // ******************************
        // View Model
        // ******************************
        var vm = this;
        // ******************************
        // Atributos publicos del controladçor
        // ******************************
        vm.listVehiculo = false;
        vm.listaDispositivo = false;
        vm.parcial = false;
        vm.elegido = {};
        vm.personaGenerada = {};
        vm.foto = 'null';
        vm.chV = [];
        vm.chD = [];
        vm.pc = false;
        vm.bSnap = false;
        vm.disableBtn = false;

        // ******************************
        // Metodos publicos ALIAS
        // ******************************
        first(); //Metodo de arranque
        vm.querySearch = querySearch;
        vm.autoPersona = autoPersona;
        vm.resetAutoPersona = resetAutoPersona;
        //vm.acompanante = acompanante;
        vm.show = show;
        vm.selectVehiculo = selectVehiculo;
        vm.powerCam = powerCam;
        vm.snap = snap;
        vm.eventoCheck = eventoCheck;
        vm.selectDispositivo = selectDispositivo;
        vm.ingreso = ingreso;
        // ******************************
        // Metodos publicos ORIGINALES
        // ******************************
        function first() {
            n.ACTIVOS = [];
        }



        function querySearch(value, table, val, name, range) {

            var objQuery = {
                table: table,
                val: val
            }
            var objColumn = {
                name: name,
                value: value
            }
            range = range ? range : 0;
            var extraWhere = ' and 1=1';
            if (table === 'nta') {
                var ocu = vm.cbParcial ? 1 : 0;
                extraWhere = ' and ocupada = ' + ocu;
            } else if (table === 'parqueadero') {
                extraWhere = 'and ocupada = 0';
            }
            return combo.filterQuery(objQuery, objColumn, range, extraWhere);

        }

        var paso = false;

        function autoPersona(data) {
            if (data) {
                paso = true;
                //Elegido = Persona seleccionada
                vm.elegido = data;
                //Selecciona la foto de la persona elegida
                b.s({
                    table: ' persona ',
                    val: ' foto ',
                    where: ' id_persona = ' + data.id_persona
                }).then(function(result) {
                    //Autocompleta el campo de nombre
                    vm.entrada = {
                        nombre: data.nombre
                    };
                    vm.bSnap = true;
                    first = false;
                    // CAMPO PARA LA FOTO
                    if (result[0].foto !== 'null' || (result[0].foto.indexOf('data') == -1)) {
                        var image = new Image();
                        image.onload = function() {
                            context.drawImage(image, 0, 0, 400, 400);
                        };
                        image.src = result[0].foto;
                    }
                });
            }
        };

        var xom = 0;

        function resetAutoPersona() {
            if (!paso) {
                //Se hace reset para elegido
                vm.elegido = {};
                //Se hace reset para campo nombre
                vm.entrada = {};
                //Se hace reset para campo foto
                vm.foto = 'null';
            } else {
                xom++;
                if (xom === 2) {
                    paso = false;
                    xom = 0;
                }
            }
        };


        //BLOCK START :: SHOW
        function show(ev, cas) {
            var k = vm.elegido.id_persona ? vm.elegido.id_persona : vm.personaGenerada.id_persona;
            //Muesttra dialogo de vehiculo
            if (cas === 'V') {
                g.dialog(ev, 1, k).then(function(response) {
                    b.s({
                        table: 'vehiculo',
                        val: '*',
                        where: 'fk_id_persona = ' + k
                    }).then(function(r) {
                        vm.listV = r;
                        h.notS('Vehiculo registrado satisfactoriamente');
                    });
                });
            } else { // De lo contrario muestra dialogo de dispositivo
                g.dialog(ev, 2, k).then(function() {
                    b.s({
                        table: 'activo',
                        val: '*',
                        where: 'fk_id_persona = ' + k
                    }).then(function(r) {
                        vm.listD = r;
                        h.notS('Dispositivo registrado satisfactoriamente');
                    });
                });
            }
        };
        //BLOCK END

        //BLOCK START :: Selecciona vehiculo
        function selectVehiculo(id, index) {
            var chV = vm.chV;
            if (!vm.ef.parqueadero.$viewValue) {
                chV[index] = false;
                h.notW('Debes seleccionar o registrar un parqueadero antes de seleccionar el vehiculo');
            } else {
                vm.vehiculo = id;
                for (var i = 0; i < chV.length; i++) {
                    if (chV[i] && i != index)
                        chV[i] = false;
                }
            }
        };
        //BLOCK END



        // BLOCK SYTART :: Selecciona Dispositivos
        function selectDispositivo(id, index) {
            console.log(id);
            var chVD = vm.chD;
            n.ACTIVOS.push(id);
        };
        //BLOCK END

        //BLOCK START :: FOTO
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var video = document.getElementById("video");
        var videoObj = {
            "video": true
        };
        var errBack = function(error) {
            console.log("Video capture error: ", error.code);
        };

        var first = true;

        function powerCam() {
            vm.pc = !vm.pc;
            if (vm.pc) { // PRENDE LA CAMARA
                if (!first)
                    vm.bSnap = !vm.bSnap;
                // Put video listeners into place
                if (navigator.webkitGetUserMedia) { // WebKit-prefixed
                    navigator.webkitGetUserMedia(videoObj, function(stream) {
                        video.src = window.URL.createObjectURL(stream);
                        video.play();
                    }, errBack);
                }
                first = false;
            } else { // DETIENE LA CAMARA
                context.drawImage(video, 0, 0, 400, 400);
                video.pause();
            }
        };

        function snap() {
            vm.bSnap = !vm.bSnap;
            context.drawImage(video, 0, 0, 400, 400);
            vm.foto = canvas.toDataURL();
            vm.pc = false;
            video.pause();
        };
        //BLOCK END
        function eventoCheck(entity) {
            var list = entity === 'vehiculo' ? vm.listVehiculo : vm.listDispositivo;
            if (list) {
                var per = vm.ef;
                // SI HAY ALGO ESCRITO EN LOS CAMPOS DE CEDULA Y NOMBRE
                if (h.ngm(per.nombre) && h.ngm(per.cedula)) {
                    if (!h.lg(vm.elegido) && !h.lg(vm.personaGenerada)) { // = Ya se seleccionó en el autocomplete la persona
                        //Inserta la persona si no existe
                        iPersona();
                    } else {
                        var id_persona = vm.elegido.id_persona ?
                            vm.elegido.id_persona : vm.personaGenerada.id_persona;

                        personaSeleccionada(id_persona, entity).then(function(response) {
                            if (entity === 'vehiculo') {
                                vm.listV = response;
                            } else {
                                vm.listD = response;
                            }
                        });

                    }
                } // SI NO HAY NADA
                else {
                    h.notW('El nombre y la cedula de la persona es necesario antes de seleccionar o registrar un vehiculo');

                    if (entity === 'vehiculo') {
                        vm.listVehiculo = false;
                    } else {
                        vm.listDispositivo = false;
                    }

                }
            }
        }

        //BLOCK START :: REGISTRAR INGRESO
        function ingreso() {
            vm.disableBtn = true;
            //Variable para cortar el frmulario
            var form = vm.ef;

            if (vm.cbParcial) { // ACOMPAÑANTE

                n.persona({
                    case: 'e',
                    parcial: true,
                    v: h.rQ([g.gStor('id_usuario'), h.ngm(form.cedula), h.ngm(form.nombre), h.ngm(form.ob), h.ngm(form.tarjeta)])
                }).then(function() {
                    h.notS('Registrado satisfactoriamente');
                    $rootScope.load = false;
                    $state.go('m.historial');
                });
            } else { // NO ES ACOMPAÑANTE
                $rootScope.load = true;
                //variable bool para validar el vehiculo
                var bolv = []
                bolv[0] = false;
                //
                if (vm.listVehiculo) { // checkbox de vehiculo en true
                    bolv[0] = true;
                    if (vm.vehiculo) {
                        // Ingreso con vehiculo
                        bolv.push(true);
                    } else {
                        //Debe seleccionar un vehiculo de la lista
                        h.notW('Debes seleccionar un vehiculo de la lista');
                        bolv.push(false);
                        vm.disableBtn = false;
                    }
                }


                if (!bolv[0] || (bolv[0] && bolv[1])) {

                    g.vR({
                        nTarjeta: h.ngm(form.tarjeta)
                    }, 'nta', " and ocupada = '1' ").then(function(response) {
                        if (response == 0) { //Ninguna fila encontrada
                            // continue con en codigo

                            ////
                            var promises = [];
                            //Variable para insertar
                            var inserto = [h.ngm(form.mv), h.ngm(form.pv), g.gStor('id_usuario')];

                            //1. PERSONA
                            var personaPromise = $q(function(resolve) {
                                if (h.lg(vm.elegido) > 0) { // EN CASO QUE SEA HAY ASELECCIONADO LA PERSONA POR EL AUTOCOMPLETE
                                    resolve(vm.elegido.id_persona);
                                } else {
                                    if (!(h.lg(vm.personaGenerada) > 0)) { // EN CASO QUE NO HATA SELECIONADO VEHICULO O DISPOSITIVO
                                        iPersona().then(function() {
                                            resolve(vm.personaGenerada.id_persona);
                                        });
                                    } else {
                                        resolve(vm.personaGenerada.id_persona);
                                    }
                                }
                            });

                            //PUSH PARA PROMESA PERSONAP
                            promises.push(personaPromise);

                            //2. AREA Y 3. OBSERVACION UNA VEZ INSERTADA EL AREA
                            var areaPromise = $q(function(resolve) {
                                g.valueRepeat('area', {
                                    key: 'nombre',
                                    value: h.ngm(form.area)
                                }).then(function(existe) {
                                    if (existe) {
                                        n.area({
                                            case: 's',
                                            v: 'id_area',
                                            w: "nombre = '" + h.ngm(form.area) + "'"
                                        }).then(function(data) {
                                            resolve([data[0].id_area, h.ngm(form.ob)]);
                                        });
                                    } else {
                                        n.area({
                                            case: 'i',
                                            v: [h.ngm(form.area)]
                                        }).then(function(data) {
                                            resolve([data[0].id_area, h.ngm(form.ob)]);
                                        });
                                    }

                                });

                            });
                            //
                            promises.push(areaPromise);
                            //4. NUMERO DE TARJETA

                            var tarjetaP = $q(function(resolve) {
                                g.valueRepeat('nta', {
                                    key: 'nTarjeta',
                                    value: h.ngm(form.tarjeta)
                                }).then(function(existe) {
                                    if (existe) {
                                        n.tarjeta({
                                            case: 's',
                                            v: 'id_nta',
                                            w: "nTarjeta = '" + h.ngm(form.tarjeta) + "'"
                                        }).then(function(data) {
                                            resolve(data[0].id_nta);
                                        });
                                    } else {
                                        n.tarjeta({
                                            case: 'i',
                                            v: [h.ngm(form.tarjeta), '0']
                                        }).then(function(data) {
                                            //PUSH PARA NTA
                                            resolve(data[0].id_nta);
                                        });
                                    }

                                });

                            });




                            promises.push(tarjetaP);

                            /* 5. PARQUEADERO
                             *  0 PUSH = 0/1 0= NADA 1= CON PARQ.
                             *  1 PUSH = ID_PARQ
                             *  2 PUSH = ID_Vehiculo
                             */

                            //Parqueadero
                            if (vm.listVehiculo) { // EN CASO QUE SE HAYA INGRESADO CON VEHICULO
                                //PROMESA DE PARQEUADERO
                                var parqueadero = h.ngm(form.parqueadero);
                                var parqueaderoP = $q(function(resolve) {


                                    g.valueRepeat('parqueadero', { // SI EXISTE EN LA LISTA
                                        key: 'id_parq',
                                        value: parqueadero
                                    }).then(function(existe) {
                                        if (existe) {
                                            resolve(['1', parqueadero])
                                        } else {
                                            n.parqueadero({
                                                case: 'i',
                                                v: [parqueadero, '0']
                                            }).then(function(data) {
                                                resolve(['1', data[0].id_parq]);
                                            });
                                        }
                                    })

                                });
                                // PROMESA PARA VEHICULO
                                var vehiculoP = $q(function(resolve) {
                                    resolve(vm.vehiculo);
                                });
                                //
                                promises.push(parqueaderoP);
                                //
                                promises.push(vehiculoP);
                                //
                            } else {
                                var sinVehiculo = $q(function(resolve) {
                                    resolve(['0', '0', '0']);
                                });
                                promises.push(sinVehiculo);
                            }
                            ///INSERTO FINAL SP_INSERTAR
                            $q.all(promises).then(function(respon) {
                                for (var i = 0; i < respon.length; i++) {
                                    if (respon[i] instanceof Array) {
                                        for (var g = 0; g < respon[i].length; g++) {
                                            inserto.push(respon[i][g])
                                        }
                                    } else {
                                        inserto.push(respon[i])
                                    }
                                }
                                //
                                n.entrada({
                                    case: 'e',
                                    v: inserto
                                }).then(function(id) {
                                    var activos = [];
                                    if (n.ACTIVOS.length > 0) {
                                        for (var i = 0; i < n.ACTIVOS.length; i++) {
                                            n.activo({
                                                case: 'i',
                                                detalle: true,
                                                v: [n.ACTIVOS[i], id],
                                            }).then(function() {
                                                if (i === n.ACTIVOS.length) {
                                                    final_success();
                                                }
                                            });
                                        }
                                    } else {
                                        final_success();
                                    }
                                });
                                //
                            });
                        } else { // mas de una fila encontrada
                            //Muestra alerta de tarjeta repetida
                            h.notW(response);
                            $rootScope.load = false;
                        }
                    });
                } else {
                    $rootScope.load = false;
                    h.notW('Debes seleccionar o registrar un vehiculo.');
                }
            }

        }

        //BLOCK END
        // ******************************
        // Metodos internos
        // ******************************
        function final_success() {
            var form = vm.ef;
            n.persona({
                case: 'u',
                v: " foto =  '" + canvas.toDataURL() + "' ",
                w: 'cedula = ' + h.ngm(form.cedula)
            }).then(function() {
                h.notS('Registrado satisfactoriamente');
                $rootScope.load = false;
                $state.go('m.historial');
            });

        }

        function personaSeleccionada(id, table) {
            //
            var w = table === 'vehiculo' ? 'id_persona = ' + id : 'fk_id_persona = ' + id;
            var vw = table === 'vehiculo' ? true : false;
            //
            var obj = {
                view: vw,
                case: 's',
                w: w
            };
            //
            return table === 'vehiculo' ? n.vehiculo(obj) : n.activo(obj);

        }

        //Función privada para registrar persona compartida por de.entrada y chVehiculo
        function iPersona(vals) {
            var def = $q.defer();
            var per = vm.ef;
            var vals = [h.ngm(per.nombre), h.ngm(per.cedula), vm.foto];

            //SI HAY FOTO TOMADA SE HACE UN PUSH AL ARRAY || NULL si no hay || MODEL si hay
            n.persona({
                case: 'i',
                v: vals
            }).then(function(data) {
                //SE LE ASIGNA A UNA VARIABLE los datos que retornan
                vm.personaGenerada = data[0];
                def.resolve(true);
            });
            return def.promise;
        }

        //Cuando todo acaba bien
        function final_success() {
            //console.log(canvas.toDataURL());
            var form = vm.ef;
            n.persona({
                case: 'u',
                v: " foto =  '" + canvas.toDataURL() + "' ",
                w: 'cedula = ' + h.ngm(form.cedula)
            }).then(function() {
                h.notS('Registrado satisfactoriamente');
                $rootScope.load = false;
                $state.go('m.historial');
            });

        }


    }
})();
