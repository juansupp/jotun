'use strict';

angular.module('jotun')
    .service('g', function($q, b, $timeout, $rootScope, $mdDialog, $mdMedia) {

        var setStorage = function(stor) { // SE PASA OBJECT
            return $q(function(resolve, reject) {
                for (var s in stor) {
                    if (window.localStorage.getItem(s))
                        window.localStorage.removeItem(s);
                    window.localStorage.setItem(s, stor[s]);
                    resolve('ya');
                }
            });
        };
        //
        var getStorage = function(arrStor) {
            if (arrStor instanceof Array) {
                var obj = "{";
                for (var i = 0; i < arrStor.length; i++)
                    obj += ' "' + arrStor[i] + '" : "' + window.localStorage.getItem(arrStor[i]) + '",';
                obj = obj.substring(0, obj.length - 1);
                obj += "}";
                obj = JSON.parse(obj);
                return obj;
            } else
                return window.localStorage.getItem(arrStor);
        };
        //
        var delStorage = function(arr) {
            if (arr instanceof Array)
                for (var i = 0; i < arr.length; i++)
                    window.localStorage.removeItem(arr[i]);
            else
                window.localStorage.removeItem(arr);
        };
        //
        var valueRepeat = function(valueObj, table, w) {
            return $q(function(resolve) {
                var promises = [];
                angular.forEach(valueObj, function(value, key) {
                    var obj = {};
                    if (w)
                        obj = {
                            "table": table,
                            "val": "*",
                            "where": key + " = '" + value + "'  " + w
                        };
                    else
                        obj = {
                            "table": table,
                            "val": "*",
                            "where": key + " = '" + value + "'"
                        };

                    var prom = $q(function(resolve) {
                        b.s(obj).then(function(data) {
                            if (data.length > 0)
                                resolve('El/La ' + key + ' ya se encuentra registrad@');
                            else
                                resolve(0);
                        });
                    });
                    promises.push(prom);
                });

                $q.all(promises).then(function(respon) {
                    var m = 0;
                    for (var i = 0; i < respon.length; i++) {
                        if (respon[i] !== 0) {
                            resolve(respon[i]);
                            break;
                        } else
                            m++;
                    }
                    if (m >= respon.length)
                        resolve(0);
                });

            });
        };
        //
        var valoresVacios = function(obj, num) {
            var x = true;
            if (obj != undefined) {
                if (Object.keys(obj).length >= num) {
                    for (var m in obj) {
                        if (obj[m] == undefined || obj[m] == "") {
                            x = false;
                        }
                    }
                } else {
                    x = false;
                }
            } else x = false;
            return x;
        };
        //
        var dialog = function(ev, val, key, modo) {
            key = key ? key : '0';
            //
            return $q(function(resolve) {

                $mdDialog.show({
                    controller: 'DialogCtrl',
                    templateUrl: 'pages/dialog/dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: {
                        v: val,
                        k: key,
                        modo: function() {
                            if (modo) {
                                return "u";

                            } else {
                                return "i";
                            }
                        }
                    }
                }).then(function(response) {
                    resolve(response);
                }).then(function() {
                    resolve();
                });
            });
        };

        //FIXME JUST ONE FUNCTION
        function valueRepeatTwo(_table, obRepeat) {
          var _val = _table;
          if (_table === 'parqueadero')
            _val = 'parq'
          var def =  $q.defer();
            b.s({
                table: _table,
                val: 'id_' + _val,
                where: obRepeat.key + "  = '" + obRepeat.value + "'    "
            }).then(function(response) {

                var res  =  response.length > 0 ? true : false ;
                def.resolve(res);
            });
            return def.promise;
        }

        return {
            sStor: setStorage,
            gStor: getStorage,
            dStor: delStorage,
            vR: valueRepeat,
            vV: valoresVacios,
            dialog: dialog,
            valueRepeat : valueRepeatTwo

        };
    });
