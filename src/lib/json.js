var DQ = DQ || {};
DQ.backends = DQ.backends || {};
DQ.backends.JSON = {};

(function(my) {
  'use strict';
  my.__type__ = 'json';

  my.fetch = function(dataset) {
    var dfd = DQ.Deferred();

    DQ.jsonp(dataset.url).then(function(data){
      var out = {};
      out.records = _.get(data, dataset.path);
      dfd.resolve(out);
    });

    return dfd.promise;
  };

}(DQ.backends.JSON));


