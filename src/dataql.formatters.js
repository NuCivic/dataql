/*jshint -W030 */

;(function(global, DQ){
  'use strict';
  DQ.fmt = {};

  DQ.fmt.toCSV = function(data) {
    var fields = _.map(_.keys(_.first(data)), function(field){
      return {id: field};
    });
    return CSV.serialize({
      fields: fields,
      records: data
    });
  };

})(window, DQ);