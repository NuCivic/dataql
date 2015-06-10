/*jshint -W030 */

;(function(global){
  'use strict';

  var castMap = {
    'string': String,
    'boolean': Boolean,
    'number': Number,
    'date': Date,
    'integer': parseInt,
    'float': parseFloat
  }

  DataQL.prototype.utils = {};

  DataQL.prototype.utils.trim = function(text){
    return text.replace(/^\s+|\s+$/gm,'');
  };

  DataQL.prototype.utils.cast = function(value, type){
    var rest = _.drop(_.toArray(arguments), 2);
    return castMap[type].apply(null, [value].concat(rest));
  };

})(window);