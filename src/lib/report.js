/*global DQ: true*/

var Report = {};

(function(my) {
  'use strict';
  my.__type__ = 'report';

  my.fetch = function(dataset) {
    var dfd = new DQ.Deferred();
    var query = new DQ();

    query
    .load(dataset.report)
    .commit(function(data){
      var out = {};
      out.records = data;
      dfd.resolve(out);
    });

    return dfd.promise;
  };

}(Report));

var DQ = DQ || {};
DQ.backends = DQ.backends || {};
DQ.backends.Report = Report;