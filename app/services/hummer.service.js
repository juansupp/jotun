'use strict'

angular.module('jotun').service('h', function($q, $mdToast, $mdDialog) {


  var returnEquals = function(ob) {
    var val = "";
    for (var i in ob)
      val += i + " = '" + ob[i] + "',";
    val = val.slice(0, -1);
    return val;
  };

  var clearText = function(text) {
    return text.replace(/\"|\'|\*|\_|\-|\s|\t|\w|\b|\n|\s|\f|\d/g, '');
  };

  var reQuotes = function(q) {
    var rQ = [];
    for (var i = 0; i < q.length; i++) {
      q[i] = q[i].toString();
      // EN CASO QUE SE QUIERA INSERTAR UN VALOR EN NULL NO SE CONCATENARAN LAS COMILLAS SIMPLES
      if (q[i] !== 'null')
        rQ[i] = "'" + q[i].replace(/'/g, '') + "'";
      else
        rQ[i] = q[i].replace(/'/g, '');
    }
    return rQ;
  };

  var dropQuotes = function(q) {
    q = q.replace(/\'/g);
    return q;
  };

  var castDate = function(date) {
    (date).setDate((date).getDate());
    var fecha = (date).getFullYear() + '-' + ('0' + ((date).getMonth() + 1)).slice(-2) + '-' + ('0' + (date).getDate()).slice(-2);
    return fecha;
  };


  var valueRepeatInObject = function(arrObj, search) {
    for (var i = 0; i < arrObj.length; i++)
      if ((arrObj[i][search.k]).toString().indexOf(search.v) != -1)
        return true;
    return false;
  };


  function not(f, a) {
    $mdToast.show(
      $mdToast.simple()
      .content(f)
      .position('bottom right')
      .hideDelay(5000)
      .theme(a + "-toast")
    );
  }
  var notW = function(f) {
    not(f, 'alert');
  };

  var notS = function(f) {
    not(f, 'success');
  };

  var notE = function(f) {
    not(f, 'error');
  };
  var leng = function(obj) {
    return Object.keys(obj).length;
  };

  var ngModelToForm = function(d) {
    return d.$modelValue === undefined ? '' : d.$modelValue;
  };


  var confirm = function(ob, ev, func) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .title(ob.t)
      .textContent(ob.tc)
      .ariaLabel('Confirmación')
      .targetEvent(ev)
      .ok('Aceptar')
      .cancel('Cancelar');

    $mdDialog.show(confirm).then(func);
  }
  return {
    clear: clearText,
    rQ: reQuotes,
    d: dropQuotes,
    cD: castDate,
    notW: notW,
    notS: notS,
    notE: notE,
    lg: leng,
    rE: returnEquals,
    vRIO: valueRepeatInObject,
    ngm: ngModelToForm,
    confirm: confirm
  };
});
