var Inline = {};

(function(my) {
  "use strict";
  my.__type__ = 'inline';

  my.fetch = function(dataset) {
    var dfd = DQ.Deferred();
    dfd.resolve(dataset);
    return dfd.promise;
  };

}(Inline));

var DQ = DQ || {};
DQ.backends = DQ.backends || {};
DQ.backends.Inline = Inline;