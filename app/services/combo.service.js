(function() {
    'use strict';

    angular.module('jotun')
        .service('combo', combo);

    function combo($q, b) {
        //Defino las variables
        var combos = new Object;
        //Estructura principal del servicio
        var service = {
            load: load,
            find: find,
            combos: combos,
            loadOne: loadOne,
            filterQuery: filterQuery
        };
        return service;


        function filterQuery(query, column, minRange,extraWhere) {
            //var results = query ? self.states.filter(createFilterFor(query)) : self.states,deferred;
            //console.log(minRange);
            query.val = query.val ? query.val : '*';
            minRange = minRange ? minRange : 0;

            var where = column.name + " like '" + column.value + "%' ";
            where += extraWhere?  extraWhere:'';
            if (column.value.length > minRange) {
                return loadOne(query.table, where, query.val);
            } else {
                var deferred = $q.defer();
                return deferred.promise;
            }
        }


        //Funciones publicas
        function find(objeto, query, key) {
            return query ? objeto.filter(globalFilter(query, key)) : objeto;
        }

        function loadOne(table, w, val) {
            var w = w ? w : '1=1';
            var v = val ? val : '*';
            var ob = {
                table: table,
                val: v,
                where: w
            };
            console.log(ob);
            return b.s(ob);
        }

        function load(ob) {
            var def = $q.defer();
            //Array para guardar cada combo = tabla
            var promises = [];
            //Loop para recorrer cada una de las tablas del objeto
            angular.forEach(ob, function(value, key) {
                //En caso que no haya un where
                value.w ? value.w : "1=1";
                //Creacion de la consulta
                var obj = {
                    table: value.table,
                    val: "*",
                    where: value.w
                };
                //Construccion de la promesa
                var prom = $q(function(resolve) {
                    b.s(obj).then(function(data) {
                        combos[value.table] = data;
                        resolve(true);
                    });
                });
                //Agrega la promesa nueva
                promises.push(prom);
            });
            //Se ejecute una vez esten resueltas las promesas
            $q.all(promises).then(function() {
                def.resolve(combos);
            });
            //retorna la promesa
            return def.promise;
        }

        //Funciones internas
        function globalFilter(query, key) {
            return function filterFn(base) {
                return ((base[key]).toString().indexOf(query) === 0);
            };
        }
    };
})();
