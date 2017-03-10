'use strict';
var sql = require('mssql');


angular.module('jotun').service('b', function($http, $q, h) {
    var params = {}; // VAL // TABLE // WHERE // PROCEDURE NAME
    function retornoErr(some) {
        if (!some)
            return true;
        else
            return false;
    }

    var config = {
        user: 'sa',
        password: 'A*96NIXZ1996',
        server: '170.117.20.7', // You can use 'localhost\instance' to connect to named instance
        database: 'rod'
    };
    
     var config = {
        user: 'Supp2',
        password: 'Supp115a05Morte500',
        server: '172.24.1.18', // You can use 'localhost\instance' to connect to named instance
        database: 'rodCali'
      };
    

    function preP(sentence, jsonMode) {
      console.log(sentence);
        return $q(function(resolve) {
            var connection = new sql.Connection(config, function(err) {
                var request = connection.request(); //new sql.Request(connection); // or: var request = connection.request();
                request.query(sentence, function(err, recordset) {
                    connection.close();
                    //console.log(sentence);
                    if (jsonMode)
                        resolve(recordset);
                    else
                        resolve(retornoErr(err));
                });
            });
        });
    }
    //select /
    var select = function(p) {
        if (p) setParams(p);
        var sentence = 'select ' + params.val.toString() + ' from ' + params.table + ' where ' + params.where;
        return preP(sentence, true);
    };

    var update = function(p) {
        if (p) setParams(p);
        var sentence = 'update ' + params.table + ' set ' + params.val.toString() + ' where ' + params.where;
        return preP(sentence, false);
    };

    var insert = function(p) {
        if (p) setParams(p);
        var sentence = 'insert into ' + params.table + ' values (' + params.val.toString() + ')';
        return preP(sentence, false);
    };
    var rExecute = function(p) {
        if (p) setParams(p);
        var sentence = 'exec  ' + params.Procedure + ' ' + params.val.toString();
        return preP(sentence, true);
    };
    var eExecute = function(p) {
        if (p) setParams(p);
        var sentence = 'exec ' + params.Procedure + ' ' + params.val.toString();
        return preP(sentence, false);
    };
    var setParams = function(p) {
        return $q(function(resolve) {
            if (p.where === undefined)
                p.where = ' 1=1 ';
            for (var o in p) {
                if (p[o] instanceof Array)
                    p[o] = p[o].toString()
                p[o] = p[o].replace(/--|select|insert|update|delete|exec|create/g, '');
            }
            params = p;
            resolve('ya');
        });
    };
    var selectLast = function(p) {
        if (p) setParams(p);
        var sentence = "select top(1) * from " + params.table + " order by " + params.val + " desc ";
        return preP(sentence, false);
    };
    return {
        s: select,
        i: insert,
        u: update,
        rE: rExecute,
        eE: eExecute,
        sL: selectLast
    };
});
